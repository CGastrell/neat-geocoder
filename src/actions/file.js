export const FILE_SET = 'FILE_SET'
export const ADDRESS_EDIT = 'ADDRESS_EDIT'

export function setFile (file) {
  return {
    type: FILE_SET,
    file
  }
}

export function editAddress (rowIndex, address) {
  return {
    type: ADDRESS_EDIT,
    rowIndex,
    address
  }
}

export const GEOCODE_REQUEST = 'GEOCODE_REQUEST'
export const GEOCODE_RECEIVE = 'GEOCODE_RECEIVE'
export const GEOCODE_ERROR = 'GEOCODE_ERROR'

const serialize = obj => Object.keys(obj).map(i => `${i}=${obj[i]}`).join('&')

export function requestGeocode (row) {
  return {
    type: GEOCODE_REQUEST,
    row
  }
}

export function receiveGeocode (row, geom, rowIndex) {
  return {
    type: GEOCODE_RECEIVE,
    row,
    geom,
    rowIndex
  }
}

export function errorGeocode (row, rowIndex) {
  return {
    type: GEOCODE_ERROR,
    row,
    rowIndex
  }
}

export function geocode (row, key = '', rowIndex) {
  return dispatch => {
    if (row.isFetching) {
      return
    }
    dispatch(requestGeocode(row))
    const urlParams = {
      region: 'ar',
      key: key,
      address: row.address
    }
    const url = `https://maps.googleapis.com/maps/api/geocode/json?${serialize(urlParams)}`


    return fetch(url)
      .then(response => response.json())
      .then(json => {
        if (json.status === 'OK' && json.results[0]) {
          return dispatch(receiveGeocode(row, json.results[0].geometry, rowIndex))
        } else {
          throw new Error(json.status)
        }
      })
      .catch(err => {
        return dispatch(errorGeocode(row, rowIndex))
      })
  }
}
