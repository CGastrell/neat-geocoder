import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles';

import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import IconButton from '@material-ui/core/IconButton'
import GeocodeIcon from '@material-ui/icons/Place'
import CircularProgress from '@material-ui/core/CircularProgress'

import { connect } from 'react-redux'
import { geocode, editAddress } from '../../actions/file'
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
    this.handleRowEdit = this.handleRowEdit.bind(this)
    this.handleGeocode = this.handleGeocode.bind(this)
  }
  handleRowEdit (event) {
    this.props.editAddress(this.props.rowIndex, event.target.value)
  }
  handleGeocode (event) {
    this.props.geocode(this.props.row, this.props.apiKey, this.props.rowIndex)
  }
  render () {
    return (
      <TableRow className={this.props.row.hadError ? this.props.classes.errorRow : ''}>
        <TableCell numeric padding="dense">{this.props.row.__rowNum__}</TableCell>
        {
          this.props.cols.map((c) => (
            <TableCell
              // onChange={this.handleRowEdit}
              // contentEditable={(c.name === 'address')}
              padding="dense"
              key={c.key}
              numeric={(c.name === 'lat' || c.name === 'lon')}
              >
                {
                  c.name === 'address'
                    ? <textarea
                        style={{width: '100%', border: 'none', fontSize: '13px', boxSizing: 'border-box'}}
                        onChange={this.handleRowEdit}
                        defaultValue={this.props.row[c.name]}>
                      </textarea>
                    : this.props.row[c.name]
                }
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
    editAddress: (row, address) => dispatch(editAddress(row, address))
  }
}
export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(AddressRow))
