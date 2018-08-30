import {
  FILE_SET,
  ADDRESS_EDIT,
  GEOCODE_RECEIVE,
  GEOCODE_ERROR,
  GEOCODE_REQUEST,
} from '../actions/file'

import defaultState from '../state'

export default (state = defaultState.file, action) => {
  switch (action.type) {
    case FILE_SET:
      return {
        ...defaultState.file,
        ...action.file
      }
    case GEOCODE_ERROR:
      let newData3 = state.data.map(row => {
        if (row.__rowNum__ === action.row.__rowNum__) {
          row.lat = ''
          row.lon = ''
          row.isFetching = false
          row.hadError = true
        }
        return row
      })
      return {
        ...state,
        data: newData3
      }
    case GEOCODE_REQUEST:
      let newData2 = state.data.map(row => {
        if (row.__rowNum__ === action.row.__rowNum__) {
          row.lat = ''
          row.lon = ''
          row.isFetching = true
          row.hadError = false
        }
        return row
      })
      return {
        ...state,
        data: newData2
      }
    case GEOCODE_RECEIVE:
      let newData;
      if (!action.row) {
        // by index, comes from marker drag
        newData = [...state.data]
        newData[action.rowIndex].lat = Number(action.geom.location.lat).toFixed(6)
        newData[action.rowIndex].lon = Number(action.geom.location.lng).toFixed(6)
        newData[action.rowIndex].hadError = false
        newData[action.rowIndex].isFetching = false
      } else {
        // by ref, comes from geocoding
        newData = state.data.map(row => {
          if (row.__rowNum__ === action.row.__rowNum__) {
            row.lat = Number(action.geom.location.lat).toFixed(6)
            row.lon = Number(action.geom.location.lng).toFixed(6)
            row.isFetching = false
            row.hadError = false
          }
          return row
        })
      }
      return {
        ...state,
        data: newData
      }
    case ADDRESS_EDIT:
      let { address, rowIndex } = action
      let data = [...state.data]
      data[rowIndex].address = address
      data[rowIndex].lat = null
      data[rowIndex].lon = null
      data[rowIndex].hadError = false
      return {
        ...state,
        data
      }
    default:
      return state
  }
}
