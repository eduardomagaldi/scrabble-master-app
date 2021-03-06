import React, { useEffect, useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Switch from '@material-ui/core/Switch';

import Definition from '../Definition'

import dataService from '../../services/data';

const useStyles = makeStyles(theme => ({
  root: {
    margin: '50px',
  },
  imgHeader: {
    maxWidth: '100%',
  },
  mobile: {
    display: 'none',
  },
  desktop: {
    display: 'block',
  },
}));

function App() {
  const allLeters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

  const classes = useStyles();
  const larger = useMediaQuery('(min-width:800px)');
  let style = classes.mobile;

  const [selectedLetters, setSelectedLetters] = useState({});
  const [scoresRanking, setScoresRanking] = useState(null);

  useEffect(() => {
    (async function () {
      if (Object.keys(selectedLetters).length) {
        const result = await dataService.getWords(Object.keys(selectedLetters));

        setScoresRanking(result.scoresRanking);
      }
    }());
  }, [selectedLetters]);

  if (larger) {
    style = classes.desktop;
  }

  return (
    <div>

      <img
        className={`${style} ${classes.imgHeader}`}
        alt="SCRABBLE"
        src="/header.png" />

      <form className={classes.root}>
        <h1>Scrabble Master App</h1>
        <h2>Select available letters:</h2>
        {allLeters.map((letter, index) => {
          return (
            // <>
            <span key={index} variant="outlined" color="primary">
              {letter.toUpperCase()}
              <Switch

                onChange={handleChange(letter)}
                name="checkedB"
                color="primary"
              />
            </span>
          );
        })}

        <Result scoresRanking={scoresRanking} />
      </form>
    </div>
  )

  function handleChange(letter) {
    return (event) => {
      if (event.target.checked) {
        const newVal = {
          ...selectedLetters,
        };

        newVal[letter] = true;

        setSelectedLetters(newVal);
      } else {
        const newVal = {
          ...selectedLetters,
        };

        delete newVal[letter];

        setSelectedLetters(newVal);
      }
    };
  }
}

export default App;

function Result({ scoresRanking }) {
  if (scoresRanking && scoresRanking.length) {
    return (
      <table>
        <thead>
          <tr>
            <th>Word</th>
            <th>Score</th>
            <th>Definition</th>
          </tr>
        </thead>
        <tbody>
          {
            scoresRanking.map((score, index) => {
              if (index < 10) {
                return (
                  <tr key={index}>
                    <td>
                      {score.word}
                    </td>

                    <td>
                      {score.score}
                    </td>

                    <td variant="outlined" color="primary">
                      <Definition show={index < 5} word={score.word} />
                    </td>
                  </tr>
                );
              } else {
                return null;
              }
            })
          }
        </tbody>
      </table>
    );
  } else {
    return <div>Please select more available letters.</div>
  }
}
