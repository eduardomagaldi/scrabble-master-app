const express = require('express');
const fs = require('fs');
const path = require('path');
// const db = require('./database');
const https = require('https');
const helmet = require('helmet');
// const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
// const cookieParser = require('cookie-parser');
const scoresByLetter = JSON.parse(fs.readFileSync('./server/data/scoresByLetter.json').toString());
const scoresByWord = {};

let options = {
    key: fs.readFileSync(path.join(__dirname, '../certificates', 'RootCA.key')),
    cert: fs.readFileSync(path.join(__dirname, '../certificates', 'RootCA.pem')),
};

app.use(helmet());
// app.use(bodyParser.json());
// app.use(cookieParser());

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


// console.log('words', words.length);

// create new user
app.get('/api/v1/:letters', async function (req, res) {
    // console.log('req.params', req.params);

    // req.params = null;

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

    filterValidWords(potentialWords, lettersSet);

    //

    // // TODO some validation/sanitization for security resons
    // const dataUser = { ...req.body };

    // const result = await db.insert(
    //     'users',
    //     Object.keys(dataUser),
    //     [dataUser],
    // );

    // if (result) {
    //     if (result.error) {
    //         res.json(result.error);
    //     } else {
    //         login(dataUser, res);
    //     }
    // } else {
    //     //TO DO validation/error handling
    // }

    res.send(Array.from(lettersSet));
});

// // login, create new session
// app.post('/api/v1/session', async function (req, res) {
//     login(req.body, res);
// });

// // logout
// app.delete('/api/v1/session', auth, async function (req, res) {
//     //TO DO delete session from database
//     res.json(true);
// });

https.createServer(options, app).listen(3001);

function getPotentialWords(lettersSet) {
    const wordsByFirstLetter = JSON.parse(fs.readFileSync('./server/data/wordsByFirstLetter.json').toString());
    let potencialWords = {};

    // console.log('wordsByFirstLetter', wordsByFirstLetter);

    lettersSet.forEach((letter) => {
        const lowerLetter = letter.toLowerCase();
        const listOfWords = wordsByFirstLetter[lowerLetter];

        potencialWords[lowerLetter] = listOfWords;
    });

    // console.log('potencialWords', potencialWords);

    return potencialWords;
}

function filterValidWords(potencialWords, lettersSet) {
    const letters = Array.from(lettersSet);
    const filteredWords = {};

    for (const letter in potencialWords) {
        filteredWords[letter] = potencialWords[letter].filter((word) => {
            let includes = true;

            for (const index in word) {
                const char = word[index].toLowerCase();

                if (!letters.includes(char)) {
                    includes = false;
                    break;
                }

                calculateScore(word, char);
            }

            return includes;
        });
    }

    console.log('filteredWords', filteredWords);
    console.log('scoresByWord', scoresByWord);
}

function calculateScore(word, char) {
    scoresByWord[word] = scoresByWord[word] || { accumulatedValue: 0, index: 0 };
    const score = scoresByWord[word];

    score.accumulatedValue = score.accumulatedValue + scoresByLetter[char].value;
    score.index++;

    return score;
}

async function auth(req, res, next) {
    if (!req.cookies.id_token) {
        res.sendStatus(401);
        return;
    }

    if (req.cookies.id_token === '$9gF5ZBptpNBaVBp0!EhvO9&5gg#DizG%#UEKoaqs3DqdpYRpZ') {
        next();
    }
}

async function login(data, res) {
    const result = await db.users.get(data.email, data.password);
    // TO DO make hash of password

    if (result) {
        const now = new Date().getTime();
        const dayInMillisec = 24 * 60 * 60 * 1000;
        const expire = new Date(now + dayInMillisec);
        const options = 'Secure; Path=/; HttpOnly';
        const token = '$9gF5ZBptpNBaVBp0!EhvO9&5gg#DizG%#UEKoaqs3DqdpYRpZ';
        // TODO generate a signed JWT

        // TO DO create session on the database const session = db.sessions.create(result);

        res.header('Set-Cookie', 'id_token=' + token + '; Expires=' + expire + '; ' + options);
        res.json(result);
    } else {
        res.sendStatus(401);
    }
}
