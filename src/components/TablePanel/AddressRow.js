import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles';

import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import IconButton from '@material-ui/core/IconButton'
import GeocodeIcon from '@material-ui/icons/Place'
import CircularProgress from '@material-ui/core/CircularProgress'

import { connect } from 'react-redux'
import { receiveGeocode, geocode, editAddress } from '../../actions/file'
const styles = theme => {
  // console.log(theme)
  return {
    errorRow: {
      backgroundColor: theme.palette.error.light
    }
  }
}
class AddressRow extends React.PureComponent {
  constructor (props) {
    super(props)
    this.handleAddressEdit = this.handleAddressEdit.bind(this)
    this.handleGeocode = this.handleGeocode.bind(this)
    this.handleLatLonEdit = this.handleLatLonEdit.bind(this)
  }
  handleLatLonEdit (event) {
    const frame = 0.0014
    // make a result-like object
    const lat = event.target.name === 'lat'
      ? Number(event.target.value)
      : Number(this.props.row['lat'])
    const lng = event.target.name === 'lon'
      ? Number(event.target.value)
      : Number(this.props.row['lon'])
    const geom = {
      location: {
        lat: lat,
        lng: lng
      },
      viewport: {
        northeast: {
          lat: lat + frame, // lat + 0.0014
          lng: lng + frame
        },
        southwest: {
          lat: lat - frame,
          lng: lng - frame
        }
      }
    }
    this.props.receiveGeocode(this.props.row, geom, this.props.rowIndex)
  }
  handleAddressEdit (event) {
    this.props.editAddress(this.props.rowIndex, event.target.value)
  }
  handleGeocode (event) {
    this.props.geocode(this.props.row, this.props.apiKey, this.props.rowIndex)
  }
  renderCell (col) {
    switch (col) {
      case 'address':
        return (
          <textarea
            style={{width: '100%', border: 'none', fontSize: '13px', boxSizing: 'border-box'}}
            onChange={this.handleAddressEdit}
            defaultValue={this.props.row[col]}>
          </textarea>
        )
      case 'lat':
      case 'lon':
        return (
          <input
            name={col}
            onChange={this.handleLatLonEdit}
            style={{padding: '8px', fontSize: '13px', border: 0, width: '100%', textAlign: 'right'}}
            step="0.00001"
            type="number"
            defaultValue={this.props.row[col]}
          />
        )
      default: return this.props.row[col]
    }
  }
  render () {
    return (
      <TableRow className={this.props.row.hadError ? this.props.classes.errorRow : ''}>
        <TableCell numeric padding="dense">{this.props.row.__rowNum__}</TableCell>
        {
          this.props.cols.map((c) => (
            <TableCell
              padding="dense"
              key={c.key}
              numeric={(c.name === 'lat' || c.name === 'lon')}
              >
                {this.renderCell(c.name)}
            </TableCell>
          ))
        }
        <TableCell padding="dense">
          <IconButton
            // color={this.props.row.hadError ? '' : 'primary'}
            onClick={this.handleGeocode}
            disabled={this.props.row.isFetching}>
            {
              this.props.row.isFetching
                ? <CircularProgress />
                : <GeocodeIcon />
            }
          </IconButton>
        </TableCell>
      </TableRow>
    )
  }
}
AddressRow.propTypes = {
  rowIndex: PropTypes.number.isRequired
}
const mapStateToProps = state => {
  return {
    apiKey: state.key
  }
}
const mapDispatchToProps = dispatch => {
  return {
    geocode: (row, key, rowIndex) => dispatch(geocode(row, key, rowIndex)),
    editAddress: (row, address) => dispatch(editAddress(row, address)),
    receiveGeocode: (row, geom, rowIndex) => dispatch(receiveGeocode(row, geom, rowIndex))
  }
}
export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(AddressRow))
