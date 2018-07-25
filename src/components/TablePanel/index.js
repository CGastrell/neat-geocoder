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
// import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

import Avatar from '@material-ui/core/Avatar'
import IconButton from '@material-ui/core/IconButton'
import CircularProgress from '@material-ui/core/CircularProgress'
// import Menu from '@material-ui/core/Menu'
// import MenuItem from '@material-ui/core/MenuItem'
// import Typography from '@material-ui/core/Typography'
import avatarColor from '@material-ui/core/colors/green'
import SaveIcon from '@material-ui/icons/Save'
import AddressTable from './AddressTable'
import XLSX from 'xlsx'
import Nprogress from 'nprogress'
import OpenIcon from '@material-ui/icons/CloudUpload'
import DeleteIcon from '@material-ui/icons/Clear'
import GeocoderIcon from '@material-ui/icons/Map'
import Tooltip from '@material-ui/core/Tooltip'
// import Zoom from '@material-ui/core/Zoom'

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
    alignItems: 'unset',
    flexShrink: 0
  },
  cardContent: {
    overflow: 'auto'
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
    backgroundColor: avatarColor[500],
  },
  hidden: {
    display: 'none'
  }
})

/* generate an array of column objects */
// const make_cols = refstr => {
//   let o = [], C = XLSX.utils.decode_range(refstr).e.c + 1
//   for (var i = 0; i < C; ++i) o[i] = {name: XLSX.utils.encode_col(i), key: i}
//   return o
// }
const geocoderColumns = col => ['address', 'lat', 'lon'].indexOf(col.name) !== -1
const defaultState = {
  // expanded: false,
  // anchorEl: null,
  name: '',
  lastUpdate: '',
  size: 0,
  sheetName: '',
  data: [], /* Array of Arrays e.g. [["a","b"],[1,2]] */
  cols: []  /* Array of column objects e.g. { name: "C", K: 2 } */
}
const sortOnRowNum = (a, b) => {
  if (a.__rowNum__ < b.__rowNum__) {
    return -1
  } else if (a.__rowNum__ > b.__rowNum__) {
    return 1
  } else {
    return 0
  }
}
const serialize = obj => Object.keys(obj).map(i => `${i}=${obj[i]}`).join('&')
class TablePanel extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {...defaultState}
    this.openFileDialog = this.openFileDialog.bind(this)
    this.handleFileOpen = this.handleFileOpen.bind(this)
    this.handleFileSave = this.handleFileSave.bind(this)
    this.handleReset = this.handleReset.bind(this)
    this.geocodeRow = this.geocodeRow.bind(this)
    this.handleMegaGeocoder = this.handleMegaGeocoder.bind(this)
  }
  updateRow (row, meta) {
    console.log(meta)
    const data = this.state.data.map(r => {
      if (r.__rowNum__ === row.__rowNum__) {
        r.isFetching = false
        if (meta.status === 'OK' && meta.results[0]) {
          r.lat = Number(meta.results[0].geometry.location.lat).toFixed(6)
          r.lon = Number(meta.results[0].geometry.location.lng).toFixed(6)
        }
      }
      return r
    })
    .sort(sortOnRowNum)
    this.setState({data})
    if (meta.status === 'OK' && meta.results[0]) {
      return meta.results[0].geometry
    }
    return null
  }
  geocodeRow (row) {
    if (row.isFetching) {
      return
    }
    const urlParams = {
      region: 'ar',
      key: this.props.apiKey,
      address: row.address
    }
    const url = `https://maps.googleapis.com/maps/api/geocode/json?${serialize(urlParams)}`

    const data = this.state.data.map(r => {
      if (r.__rowNum__ === row.__rowNum__) {
        r.isFetching = true
      }
      return r
    })
    this.setState({data})
    fetch(url)
      .then(response => response.json())
      .then(json => this.updateRow(row, json))
      .then(geom => {
        if (geom) {
          this.props.handleGeocode(row, geom)
          this.props.handleZoomToGeom(geom)
        }
      })
      .catch(err => {
        this.updateRow(row, err)
      })
  }
  handleFileOpen (event) {
    var file = event.target.files[0];
    if (!file) {
      return;
    }
    /* Boilerplate to set up FileReader */
    const reader = new FileReader()
    const rABS = !!reader.readAsBinaryString
    reader.onload = (e) => {
      /* Parse data */
      const bstr = e.target.result
      const wb = XLSX.read(bstr, {type: rABS ? 'binary' : 'array'})
      /* Get first worksheet */
      const wsname = wb.SheetNames[0]
      const ws = wb.Sheets[wsname]
      /* Convert array of arrays */
      const data = XLSX.utils.sheet_to_json(ws, {header: 0})

      const trueCols = Object.keys(data[0])
      // reject an xls without `address` column
      if (trueCols.indexOf('address') === -1) {
        alert('No `address` column found')
        Nprogress.done()
        return
      }

      // add lat lon columns
      if (trueCols.indexOf('lat') === -1) {
        trueCols.push('lat')
      }
      if (trueCols.indexOf('lon') === -1) {
        trueCols.push('lon')
      }
      // conform to enumerable cols
      const cols = trueCols.map((col, idx) => ({key: idx + 1, name: col}))
      // add fetching marker to all rows
      const superData = data.map(row => {
        row.isFetching = false
        if (!row.lat) {
          row.lat = null
        }
        if (!row.lon) {
          row.lon = null
        }
        return row
      })
      .sort(sortOnRowNum)

      /* Update state */
      this.setState({
        data: superData,
        cols,
        name: file.name,
        size: file.size,
        sheetName: wsname,
        lastUpdate: file.lastModified
      })
      Nprogress.done()
    }
    Nprogress.start()
    if (rABS) {
      reader.readAsBinaryString(file)
    } else {
      reader.readAsArrayBuffer(file)
    }
    // reset so next open is forced to be a `change` event
    event.target.value = event.target.defaultValue
  }
  handleFileSave (event) {
    // remove utility columns
    const data = this.state.data.map(row => {
      let { isFetching, ...trueRow } = row
      return trueRow
    })

    var wb = XLSX.utils.book_new()
    var ws = XLSX.utils.json_to_sheet(data)
    XLSX.utils.book_append_sheet(wb, ws, this.state.sheetName)
    let filename = this.state.name || 'workbook.xlsx'
    const filenameParts = filename.split('.')
    if (filenameParts.length > 1) {
      filenameParts.pop() // remove extension
      filenameParts.push('xlsx') // add xlsx extension
      if (filenameParts[filenameParts.length - 2] !== undefined) {
        filenameParts[filenameParts.length - 2] += '_geocoded'
        filename = filenameParts.join('.')
      }
    }

    XLSX.writeFile(wb, filename)
  }
  handleReset (event) {
    this.setState(defaultState)
  }
  // handleExpandClick = () => {
  //   this.setState(state => ({ expanded: !state.expanded }))
  // }
  // handleMenu = event => {
  //   this.setState({ anchorEl: event.currentTarget })
  // }
  // handleClose = () => {
  //   this.setState({ anchorEl: null })
  // }
  handleMegaGeocoder (event) {
    if (!this.props.apiKey) {
      alert(`
        I won't do that without an Google Maps API key.
        You're trying to geocode ${this.state.data.length} entries. You can use the
        button on each row to geocode as Google allows it.
      `)
      return
    }
    if (this.props.geocoding) return
    this.props.handleMegaGeocode(true)
    // make a queue here, set overall status with the handler from app
    // https://caolan.github.io/async/docs.html#parallelLimit
    let processedRows = 0
    const fetchGeocode = idx => {
      if (!this.state.data[idx]) {
        this.props.handleZoomToGeom(false)
        this.props.handleMegaGeocode(false)
        return
      } else {
        const row = this.state.data[idx]
        processedRows++

        const urlParams = {
          region: 'ar',
          key: this.props.apiKey,
          address: row.address
        }
        const url = `https://maps.googleapis.com/maps/api/geocode/json?${serialize(urlParams)}`

        const data = this.state.data.map(r => {
          if (r.__rowNum__ === row.__rowNum__) {
            r.isFetching = true
          }
          return r
        })
        this.setState({data})
        fetch(url)
          .then(response => response.json())
          .then(json => this.updateRow(row, json))
          .then(geom => {
            this.props.handleGeocode(row, geom)
            this.props.handleZoomToGeom()
            fetchGeocode(processedRows)
          })
          .catch(err => {
            fetchGeocode(processedRows)
          })

      }
    }
    fetchGeocode(processedRows)
  }
  openFileDialog (event) {
    this.refs.fileUploader.click()
  }

  render() {
    const { classes } = this.props
    const hasFile = Boolean(this.state.name && this.state.lastUpdate)
    const meta = hasFile
      ? `${new Date(this.state.lastUpdate).toLocaleString()} - ${this.state.size / 1000} kb`
      : ''

    return (
      <div className={classes.root}>
        <Card className={classes.card}>
          <CardHeader
            className={classnames(classes.cardHeader)}
            avatar={
              <Avatar aria-label="Recipe" className={classnames(classes.avatar, !this.state.name && classes.hidden)}>
                {this.state.name.substr(0, 1)}
              </Avatar>
            }
            action={
              <React.Fragment>
                <Tooltip
                  disableFocusListener={true}
                  disableTouchListener={true}
                  title="Open file">
                  <IconButton
                    color={hasFile ? 'primary' : 'secondary'}
                    aria-label="Open file"
                    disabled={this.props.geocoding}
                    onClick={this.openFileDialog}>
                    <OpenIcon />
                    <input onChange={this.handleFileOpen} type="file" id="file" ref="fileUploader" style={{display: "none"}}/>
                  </IconButton>
                </Tooltip>
                <Tooltip
                  disableFocusListener={true}
                  disableTouchListener={true}
                  title="Save xlsx">
                  <IconButton
                    color={hasFile ? 'primary' : 'default'}
                    disabled={!hasFile || this.props.geocoding}
                    onClick={this.handleFileSave}>
                    <SaveIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip
                  disableFocusListener={true}
                  disableTouchListener={true}
                  title="Reset">
                  <IconButton
                    color="default"
                    disabled={!hasFile || this.props.geocoding}
                    onClick={this.handleReset}>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip
                  disableFocusListener={true}
                  disableTouchListener={true}
                  title="Geocode!">
                  <IconButton
                    color="secondary"
                    disabled={!hasFile}
                    onClick={this.handleMegaGeocoder}>
                    {
                      this.props.geocoding
                        ? <CircularProgress color="secondary" />
                        : <GeocoderIcon />
                    }
                  </IconButton>
                </Tooltip>
              </React.Fragment>
            }
            title={this.state.name || 'Open .xlsx file'}
            subheader={meta || 'Yeah, use the red cloudy button. Trust me, I\'m an engineer'}
          />
          {/* <Menu
            id="simple-menu"
            anchorEl={this.state.anchorEl}
            open={Boolean(this.state.anchorEl)}
            onClose={this.handleClose}
          >
            <MenuItem onClick={this.handleClose}>Profile</MenuItem>
            <MenuItem onClick={this.handleClose}>My account</MenuItem>
            <MenuItem onClick={this.handleClose}>Logout</MenuItem>
          </Menu> */}
          <CardContent className={classes.cardContent}>
            <AddressTable geocode={this.geocodeRow} data={this.state.data} cols={this.state.cols.filter(geocoderColumns)} />
          </CardContent>
          {/* <CardActions className={classes.actions} disableActionSpacing>
            <IconButton aria-label="Add to favorites">
              <FavoriteIcon />
            </IconButton>
            <IconButton aria-label="Share">
              <ShareIcon />
            </IconButton>
            <IconButton
              className={classnames(classes.expand, {
                [classes.expandOpen]: this.state.expanded,
              })}
              onClick={this.handleExpandClick}
              aria-expanded={this.state.expanded}
              aria-label="Show more"
            >
              <ExpandMoreIcon />
            </IconButton>
          </CardActions> */}

        </Card>
      </div>
    )
  }
}

TablePanel.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(TablePanel)
