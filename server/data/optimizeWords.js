const express = require('express');
const fs = require('fs');

const words = JSON.parse(fs.readFileSync('./server/data/words.json').toString());
const wordsByFirstLetter = {};

words.forEach((word) => {
    const firstLetter = word[0];

    wordsByFirstLetter[firstLetter] = wordsByFirstLetter[firstLetter] || [];
    wordsByFirstLetter[firstLetter].push(word);
});

fs.writeFileSync('./server/data/wordsByFirstLetter.json', JSON.stringify(wordsByFirstLetter));