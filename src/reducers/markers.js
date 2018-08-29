import {
  FILE_SET,
  GEOCODE_RECEIVE
} from '../actions/file'
import defaultState from '../state'

export default (state = defaultState.markers, action) => {
  switch (action.type) {
    case GEOCODE_RECEIVE:
      if (!action.row) return state
      let { row, geom, rowIndex } = action
      let markers = {...state}
      markers[row.__rowNum__] = {
        rowIndex: rowIndex,
        rowNum: row.__rowNum__,
        address: row.address,
        position: [geom.location.lat, geom.location.lng]
      }
      return markers
    case FILE_SET:
      return {}
    default:
      return state
  }
}
