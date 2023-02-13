import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';

const app = express();

const PORT = process.env.PORT;
const apiKey = process.env.KEY;
const hostURL = 'http://localhost:8000';

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", hostURL);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

const muscles = [
    'abdominals',
    'abductors',
    'adductors',
    'biceps',
    'calves',
    'chest',
    'forearms',
    'glutes',
    'hamstrings',
    'lats',
    'lower_back',
    'middle_back',
    'neck',
    'quadriceps',
    'traps',
    'triceps'
];

const difficulties = [
    'beginner',
    'intermediate',
    'expert'
];

app.get('/', async (req, res) => {
    const url = 'https://api.api-ninjas.com/v1/exercises';
    
    // all difficulties per muscle
    const results = []
    
    for (const muscle of muscles) {
        for (const difficulty of difficulties) {
            const result = await fetch(url + `?muscle=${muscle}&difficulty=${difficulty}` , {
                method: 'get',
                headers: {
                    'X-Api-Key': apiKey
                }
            })
                .then(response => response.json())
            results.push(...result);
        }
    }
    res.status(200).send(results);
});

app.get('/:muscle', async (req, res) => {
    const muscle = req.params.muscle;
    const url = `https://api.api-ninjas.com/v1/exercises?muscle=${muscle}`

    const resultBeginner = await fetch(url + '&difficulty=beginner', {
        method: 'get',
        headers: {
            'X-Api-Key': apiKey
        }
    })
        .then(response => response.json())

    const resultIntermediate = await fetch(url + '&difficulty=intermediate', {
        method: 'get',
        headers: {
            'X-Api-Key': apiKey
        }
    })
        .then(response => response.json())

    const resultExpert = await fetch(url + '&difficulty=expert', {
        method: 'get',
        headers: {
            'X-Api-Key': apiKey
        }
    })
        .then(response => response.json())

    const results = resultBeginner.concat(resultIntermediate, resultExpert);
    // console.log(resultBeginner.length);
    // console.log(resultIntermediate.length);
    // console.log(resultExpert.length);
    // console.log(results.length);
    // console.log(resultExpert);
    if (results.length !== 0) {
        res.status(200).send(results);
    }
    else {
        res.send(404).send('No exercises found.');
    }
});


app.listen(PORT, () => {
    console.log(`Microservice connected to port ${PORT}.`);
});