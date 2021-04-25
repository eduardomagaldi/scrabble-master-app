const express = require('express');
const fs = require('fs');
const path = require('path');
const https = require('https');
const helmet = require('helmet');
const app = express();
const cors = require('cors');
const scoresByLetter = JSON.parse(fs.readFileSync('./server/data/scoresByLetter.json').toString());

let options = {
    key: fs.readFileSync(path.join(__dirname, '../certificates', 'RootCA.key')),
    cert: fs.readFileSync(path.join(__dirname, '../certificates', 'RootCA.pem')),
};

app.use(helmet());

const port = '3000';

app.use(
    cors({
        origin: `https://localhost:${port}`,
        credentials: true,
        exposedHeaders: 'Location',
        optionsSuccessStatus: 200,
    }),
);

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', `https://localhost:${port}`);
    res.set("Content-Security-Policy", "default-src *; style-src 'self' http://* 'unsafe-inline'; script-src 'self' http://* 'unsafe-inline' 'unsafe-eval'")
    next();
});

// app.use(express.static('build'));

app.get('/api/v1/:letters', async function (req, res) {
    const lettersParam = req && req.params && req.params.letters ? req.params.letters : null;

    if (!lettersParam) {
        res.sendStatus(422);
        return;
    }

    let letters = lettersParam.split(',');

    if (!letters.length) {
        res.sendStatus(422);
        return;
    }

    const lettersSet = new Set();

    letters.forEach((letter) => {
        if (letter) {
            lettersSet.add(letter);
        }
    });

    const potentialWords = getPotentialWords(lettersSet);
    const result = filterValidWords(potentialWords, lettersSet);

    res.send(result);
});

https.createServer(options, app).listen(3001);

function getPotentialWords(lettersSet) {
    const wordsByFirstLetter = JSON.parse(fs.readFileSync('./server/data/wordsByFirstLetter.json').toString());
    let potencialWords = {};

    lettersSet.forEach((letter) => {
        const lowerLetter = letter.toLowerCase();
        const listOfWords = wordsByFirstLetter[lowerLetter];

        potencialWords[lowerLetter] = listOfWords;
    });

    return potencialWords;
}

function filterValidWords(potencialWords, lettersSet) {
    const letters = Array.from(lettersSet);
    const filteredWords = {};
    const scoresByWord = {};
    const scoresRanking = [];

    for (const letter in potencialWords) {
        filteredWords[letter] = potencialWords[letter].filter((word) => {
            let includes = true;

            for (const index in word) {
                const char = word[index].toLowerCase();

                if (!letters.includes(char)) {
                    includes = false;
                    break;
                }

                calculateScore(word, char, scoresByWord, scoresRanking);
            }

            return includes;
        });
    }

    return {
        validWords: filteredWords,
        scoresRanking: scoresRanking,
    };
}

function calculateScore(word, char, scoresByWord, scoresRanking) {
    scoresByWord[word] = scoresByWord[word] || { accumulatedValue: 0, index: 0 };
    const score = scoresByWord[word];

    score.accumulatedValue = score.accumulatedValue + scoresByLetter[char].value;
    score.index++;

    if (score.index === word.length) {
        scoresRanking.push({
            score: score.accumulatedValue,
            word: word,
        });

        scoresRanking.sort(sortByScore);
    }
}

function sortByScore(a, b) {
    if (a.score < b.score) {
        return 1;
    }

    if (a.score > b.score) {
        return -1;
    }

    return 0;
}
