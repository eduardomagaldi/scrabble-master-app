const express = require('express');
const fs = require('fs');

const scores = JSON.parse(fs.readFileSync('./server/data/scores.json').toString());
const scoresByLetter = {};

scores.forEach((score) => {
    const newScore = { ...score };
    delete newScore.letter;
    scoresByLetter[score.letter.toLowerCase()] = newScore;
});

fs.writeFileSync('./server/data/scoresByLetter.json', JSON.stringify(scoresByLetter));