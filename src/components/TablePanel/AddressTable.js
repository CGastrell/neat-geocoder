import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import IconButton from '@material-ui/core/IconButton'
import GeocodeIcon from '@material-ui/icons/Place'
import CircularProgress from '@material-ui/core/CircularProgress'

const styles = theme => ({
  root: {
    width: '100%',
    // marginTop: theme.spacing.unit * 3,
    // overflowX: 'auto',
  },
  table: {
    // minWidth: 700,
  }
})
class AddressRow extends React.PureComponent {
  // constructor (props) {
  //   super (props)
  //   this.state = {
  //     isFetching: false
  //   }
  //   this.handleClick = this.handleClick.bind(this)
  // }
  // handleClick (event) {
  //   this.setState({
  //     isFetching: true
  //   })
  //   this.props.geocode(this.props.row)
  //     .then(json => {
  //       console.log(json)
  //     })
  //     .catch(err => err)
  //     .then(nomatter => {
  //       console.log(nomatter)
  //       this.setState({isFetching: false})
  //     })
  // }
  render () {
    return (
      <TableRow>
        <TableCell numeric padding="dense">{this.props.row.__rowNum__}</TableCell>
        {
          this.props.cols.map(c => (
            <TableCell padding="dense" key={c.key} numeric={(c.name === 'lat' || c.name === 'lon')}>
              { this.props.row[c.name] }
            </TableCell>
          ))
        }
        <TableCell padding="dense">
          <IconButton onClick={() => this.props.geocode(this.props.row)} disabled={this.props.row.isFetching}>
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
/*
  Simple HTML Table
  usage: <OutTable data={data} cols={cols} />
    data:Array<Array<any> >;
    cols:Array<{name:string, key:number|string}>;
*/
class OutTable extends React.Component {
  render () {
    const { classes } = this.props
    if (this.props.cols.length === 0) {
      return null
    }
    return (
      <div className={classes.root}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell padding="dense">#</TableCell>
              {
                this.props.cols.map((c) => (
                  <TableCell key={c.key}>
                    {c.name}
                  </TableCell>
                ))
              }
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              this.props.data.map((r, i) => {
                return (
                  <AddressRow
                    geocode={this.props.geocode}
                    key={r.__rowNum__}
                    cols={this.props.cols}
                    row={r} />
                )
              })
            }
          </TableBody>
        </Table>
      </div>
    )
  };
}

OutTable.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(OutTable)
