import React from 'react'
import Grid from '@material-ui/core/Grid'
import TablePanel from './components/TablePanel'
import { withStyles } from '@material-ui/core/styles'
// import Paper from '@material-ui/core/Paper'
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
      // padding: theme.spacing.unit * 2,
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
            <Grid item xs={6}>
              <TablePanel
                apiKey={props.apiKey}
                geocoding={props.geocoding}
                handleGeocode={props.handleGeocode}
                handleMegaGeocode={props.handleMegaGeocode}
                handleZoomToGeom={props.handleZoomToGeom}
                className={props.classes.paper}
              />
              {/* <Paper className={props.classes.paper}> </Paper> */}
            </Grid>
            <Grid item xs={6}>
              <MapPanel
                geocoding={props.geocoding}
                mapParams={props.mapParams}
                className={props.classes.paper}
                markers={props.markers} />
              {/* <Paper className={props.classes.paper}>
              </Paper> */}
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  )
}

export default withStyles(styles)(Layout)
