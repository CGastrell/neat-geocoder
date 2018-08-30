import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import classnames from 'classnames'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import AttachmentIcon from '@material-ui/icons/Attachment'
// import ShareIcon from '@material-ui/icons/Share'
// import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

import Avatar from '@material-ui/core/Avatar'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
// import Menu from '@material-ui/core/Menu'
// import MenuItem from '@material-ui/core/MenuItem'
// import Typography from '@material-ui/core/Typography'
import avatarColor from '@material-ui/core/colors/green'
import SaveIcon from '@material-ui/icons/CloudDownload'
import AddressTable from './AddressTable'
import XLSX from 'xlsx'
import Nprogress from 'nprogress'
import OpenIcon from '@material-ui/icons/CloudUpload'
import DeleteIcon from '@material-ui/icons/Clear'
import GeocoderIcon from '@material-ui/icons/Map'
import Tooltip from '@material-ui/core/Tooltip'
// import Zoom from '@material-ui/core/Zoom'
import { connect } from 'react-redux'
import { setFile, geocode } from '../../actions/file'
import { setGeocoding, setIdle } from '../../actions/misc'
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

const geocoderColumns = col => ['address', 'lat', 'lon'].indexOf(col.name) !== -1
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
    // this.state = {...defaultState}
    this.openFileDialog = this.openFileDialog.bind(this)
    this.handleFileOpen = this.handleFileOpen.bind(this)
    this.handleFileSave = this.handleFileSave.bind(this)
    this.handleReset = this.handleReset.bind(this)
    this.handleMegaGeocoder = this.handleMegaGeocoder.bind(this)
  }
  openFileDialog (event) {
    this.refs.fileUploader.click()
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
        row.hadError = false
        row.isFetching = false
        // normalize lat/lon columns
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
      this.props.setFileData({
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
    const {file} = this.props
    // remove utility columns
    const data = file.data.map(row => {
      let { isFetching, hadError, ...trueRow } = row
      return trueRow
    })

    var wb = XLSX.utils.book_new()
    var ws = XLSX.utils.json_to_sheet(data)
    XLSX.utils.book_append_sheet(wb, ws, file.sheetName)
    let filename = file.name || 'workbook.xlsx'
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
    this.props.setFileData({})
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
    if (this.props.geocoding) return
    if (!this.props.apiKey) {
      alert(`
        I won't do that without an Google Maps API key.
        You're trying to geocode ${this.props.file.data.length} entries. You can use the
        button on each row to geocode as Google allows it.
      `)
      return
    }
    this.props.setGeocoding()
    // make a queue here, set overall status with the handler from app
    // https://caolan.github.io/async/docs.html#parallelLimit
    let processedRows = 0
    const fetchGeocode = idx => {
      if (!this.props.file.data[idx]) {
        console.log('ended')
        this.props.setIdle()
        // this.props.handleZoomToGeom(false)
        // this.props.handleMegaGeocode(false)
        return
      } else {
        const row = this.props.file.data[idx]
        processedRows++

        this.props.geocode(row, this.props.apiKey, idx)
          .then(action => {
            // console.log(action)
            // should zoom to big geom here
            fetchGeocode(processedRows)
          })
          .catch(err => {
            console.warn(err)
            this.props.setIdle()
          })
      }
    }
    fetchGeocode(processedRows)
  }

  render() {
    const { classes, file } = this.props
    const hasFile = Boolean(file.name && file.lastUpdate)
    const meta = hasFile
      ? `${new Date(file.lastUpdate).toLocaleString()} - ${file.size / 1000} kb`
      : ''

    return (
      <div className={classes.root}>
        <Card className={classes.card}>
          <CardHeader
            className={classnames(classes.cardHeader)}
            avatar={
              <Avatar aria-label="File" className={classnames(classes.avatar, !file.name && classes.hidden)}>
                {file.name.substr(0, 1)}
              </Avatar>
            }
            action={
              <React.Fragment>
                <Tooltip
                  disableFocusListener={true}
                  disableTouchListener={true}
                  title="Open file">
                  <span>
                    <IconButton
                      color={hasFile ? 'primary' : 'secondary'}
                      aria-label="Open file"
                      disabled={this.props.geocoding}
                      onClick={this.openFileDialog}>
                      <OpenIcon />
                      <input onChange={this.handleFileOpen} type="file" id="file" ref="fileUploader" style={{display: "none"}}/>
                    </IconButton>
                  </span>
                </Tooltip>
                <Tooltip
                  disableFocusListener={true}
                  disableTouchListener={true}
                  title="Geocode!">
                  <span>
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
                  </span>
                </Tooltip>
                <Tooltip
                  disableFocusListener={true}
                  disableTouchListener={true}
                  title="Save .xlsx">
                  <span>
                    <IconButton
                      color={hasFile ? 'primary' : 'default'}
                      disabled={!hasFile || this.props.geocoding}
                      onClick={this.handleFileSave}>
                      <SaveIcon />
                    </IconButton>
                  </span>
                </Tooltip>
                <Tooltip
                  disableFocusListener={true}
                  disableTouchListener={true}
                  title="Reset">
                  <span>
                    <IconButton
                      color="default"
                      disabled={!hasFile || this.props.geocoding}
                      onClick={this.handleReset}>
                      <DeleteIcon />
                    </IconButton>
                  </span>
                </Tooltip>
              </React.Fragment>
            }
            title={file.name || 'Open .xlsx file'}
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
            <AddressTable data={file.data} cols={file.cols.filter(geocoderColumns)} />
          </CardContent>
          <CardActions className={classes.actions} disableActionSpacing>
            <Button
              href="test.xlsx"
              component="a"
              download="test.xlsx"
              aria-label="Download sample file">
              Sample file (for testing)
              <AttachmentIcon />
            </Button>
          </CardActions>

        </Card>
      </div>
    )
  }
}

TablePanel.propTypes = {
  classes: PropTypes.object.isRequired,
  apiKey: PropTypes.string,
  geocoding: PropTypes.bool,
  file: PropTypes.object,
}

const mapStateToProps = state => {
  return {
    file: state.file,
    apiKey: state.key,
    geocoding: state.geocoding
  }
}
const mapDispatchToProps = dispatch => {
  return {
    setFileData: data => dispatch(setFile(data)),
    setGeocoding: () => dispatch(setGeocoding()),
    setIdle: () => dispatch(setIdle()),
    geocode: (row, key, rowIndex) => dispatch(geocode(row, key, rowIndex))
  }
}
export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(TablePanel))
