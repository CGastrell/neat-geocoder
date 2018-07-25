import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Beenhere';
import SetKeyIcon from '@material-ui/icons/Save';
import FormControl from '@material-ui/core/FormControl'
import Input from '@material-ui/core/Input'
import InputAdornment from '@material-ui/core/InputAdornment'
import InputLabel from '@material-ui/core/InputLabel'
import classNames from 'classnames'

const styles = {
  root: {
    // flexGrow: 1,
  },
  flex: {
    flex: 1,
  },
  formlabel: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  formcontrol: {
    color: 'rgba(255, 255, 255, 0.8)'
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
};

class TopBar extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = { key: '' }
    this.handleKeySave = this.handleKeySave.bind(this)
    this.handleKeyChange = this.handleKeyChange.bind(this)
  }
  componentDidMount () {
    if (window && window.localStorage) {
      let key = window.localStorage.getItem('gmapiKey')
      if (key) {
        this.setState({key})
        this.props.setKey(key)
      }
    }
  }
  handleKeySave (event) {
    if (window && window.localStorage) {
      window.localStorage.setItem('gmapiKey', this.state.key)
    }
    this.props.setKey(this.state.key)
  }
  handleKeyChange (event) {
    this.setState({
      key: event.target.value
    })
  }
  render () {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <AppBar position="static" color="primary">
          <Toolbar>
            <IconButton className={classes.menuButton} color="inherit">
              <MenuIcon />
            </IconButton>
            <Typography variant="title" color="inherit" className={classes.flex}>
              Geocoder
            </Typography>
            <FormControl color="secondary" className={classNames(classes.flex, classes.formcontrol)} >
              <InputLabel className={classes.formlabel} htmlFor="adornment-password">Google Maps API key</InputLabel>
              <Input
                className={classes.formcontrol}
                id="adornment-password"
                type="text"
                value={this.state.key}
                onChange={this.handleKeyChange}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="Set API key"
                      // onChange={this.handleKeyChange}
                      onClick={this.handleKeySave}
                      onMouseDown={e => e.preventDefault()}
                    >
                      <SetKeyIcon />
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

TopBar.propTypes = {
  classes: PropTypes.object.isRequired,
  setKey: PropTypes.func.isRequired
};

export default withStyles(styles)(TopBar);
