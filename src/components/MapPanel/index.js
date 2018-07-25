import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import classnames from 'classnames'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
// import CardActions from '@material-ui/core/CardActions'
// import FavoriteIcon from '@material-ui/icons/Favorite'
// import ShareIcon from '@material-ui/icons/Share'
// import Avatar from '@material-ui/core/Avatar'
// import IconButton from '@material-ui/core/IconButton'
// import MoreVertIcon from '@material-ui/icons/MoreVert'

// import Menu from '@material-ui/core/Menu'
// import MenuItem from '@material-ui/core/MenuItem'
// import Typography from '@material-ui/core/Typography'
import red from '@material-ui/core/colors/red'

// import Nprogress from 'nprogress'

import LeMap from './Map'
const styles = theme => ({
  root: {
    height: '100%',
  },
  card: {
    // overflow: 'auto',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    maxHeight: '100%'
  },
  cardHeader: {
    alignItems: 'unset'
  },
  cardContent: {
    height: '500px'
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  actions: {
    display: 'flex',
  },
  expand: {
    transform: 'rotate(0deg)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
    marginLeft: 'auto',
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
  hidden: {
    display: 'none'
  }
})

class MapPanel extends React.PureComponent {
  render() {
    const { classes } = this.props
    return (
      <div className={classes.root}>
        <Card className={classes.card}>
          <CardHeader
            className={classnames(classes.cardHeader)}
            // avatar={
            //   <Avatar aria-label="Recipe" className={classnames(classes.avatar)}>
            //     M
            //   </Avatar>
            // }
            // action={
            //   <React.Fragment>
            //     <IconButton onClick={this.handleMenu}>
            //       <MoreVertIcon />
            //     </IconButton>
            //   </React.Fragment>
            // }
            title={`Map`}
            subheader={`Results`}
          />
          <CardContent className={classes.cardContent}>
            <LeMap mapParams={this.props.mapParams} markers={this.props.markers} />
          </CardContent>
          {/* <CardActions className={classes.actions} disableActionSpacing>
            <IconButton aria-label="Add to favorites">
              <FavoriteIcon />
            </IconButton>
            <IconButton aria-label="Share">
              <ShareIcon />
            </IconButton>
          </CardActions> */}
        </Card>
      </div>
    )
  }
}

MapPanel.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(MapPanel)
