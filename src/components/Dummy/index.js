import React from 'react'

import { makeStyles } from '@material-ui/core/styles'
import { Button } from '@material-ui/core'
import useMediaQuery from '@material-ui/core/useMediaQuery';

const useStyles = makeStyles(theme => ({
  root: {
    // display: 'flex',
    // alignItems: 'center',
    // justifyContent: 'center',
    // height: theme.spacing(50)
  },
  imgHeader: {
    // display: 'none',
    maxWidth: '100%',
  },
  mobile: {
    display: 'none',
  },
  desktop: {
    display: 'block',
  },
}));

function Dummy() {
  const classes = useStyles();
  const larger = useMediaQuery('(min-width:800px)');
  let style = classes.mobile;

  if (larger) {
    style = classes.desktop;
  }

  return (
    <div>
      <img
        className={`${style} ${classes.imgHeader}`}
        alt="SCRABBLE"
        src="/header.png" />
    </div>
  )
}

export default Dummy;