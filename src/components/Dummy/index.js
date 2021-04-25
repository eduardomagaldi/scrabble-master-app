import React from 'react'

import { makeStyles } from '@material-ui/core/styles'
import { Button } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: theme.spacing(50)
  }
}))

function Dummy ({  }) {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Button color="primary" onClick={() => { console.log('Hello App!') }}>Hello World!</Button>
    </div>
  )
}

export default Dummy