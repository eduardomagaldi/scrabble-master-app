import React from 'react'

import { makeStyles } from '@material-ui/core/styles'
import { Button } from '@material-ui/core'

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
  }
}));

function Dummy() {
  const classes = useStyles();

  return (
    <div>
      <img
        className={classes.imgHeader}
        alt="SCRABBLE"
        src="/header.png" />

      {/* <Button color="primary" onClick={() => { console.log('Hello App!') }}>Hello World!</Button> */}
    </div>
  )
}

export default Dummy;