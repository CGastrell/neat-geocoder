import React from 'react'
import PropTypes from 'prop-types'
import Grid from '@material-ui/core/Grid'
import TablePanel from './components/TablePanel'
import { withStyles } from '@material-ui/core/styles'

import MapPanel from './components/MapPanel'
const styles = theme => {
  // console.log(theme)
  return {
    flatRoot: {
      position: 'relative',
      flexGrow: 1
    },
    ultraroot: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      overflow: 'auto',
      display: 'flex'
    },
    root: {
      position: 'relative',
      flexGrow: 1,
      backgroundColor: theme.palette.grey[300],
      padding: theme.spacing.unit * 2,
      boxSizing: 'border-box',
      maxWidth: '100%'
    },
    grid: {
      height: '100%',
    },
    paper: {
      padding: theme.spacing.unit * 2,
      textAlign: 'center',
      color: theme.palette.text.secondary,
      maxHeight: '100%',
      overflow: 'auto'
    }
  }
}

const Layout = props => {
  return (
    <div className={props.classes.flatRoot}>
      <div className={props.classes.ultraroot}>
        <div className={props.classes.root}>
          <Grid container spacing={24} className={props.classes.grid}>
            <Grid item xs={7} style={{height: '100%'}}>
              <TablePanel className={props.classes.paper} />
            </Grid>
            <Grid item xs={5}>
              <MapPanel className={props.classes.paper} />
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  )
}

Layout.propTypes = {
  classes: PropTypes.object.isRequired
}
export default withStyles(styles)(Layout)
