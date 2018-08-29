import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import AddressRow from './AddressRow'

const styles = theme => ({
  root: {
    width: '100%',
  },
  table: { }
})
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
                    rowIndex={i}
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
  cols: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired
}

export default withStyles(styles)(OutTable)
