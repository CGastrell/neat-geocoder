let key = ''
try {
  key = window.localStorage.getItem('gmapiKey')
} catch (err) {
  // go silently
  key = ''
}
export default {
  markers: {},
  mapParams: {
    center: [-35.5, -57],
    bounds: false
  },
  key: key,
  file: {
    name: '',
    lastUpdate: '',
    size: 0,
    sheetName: '',
    data: [], /* Array of Arrays e.g. [["a","b"],[1,2]] */
    cols: []  /* Array of column objects e.g. { name: "C", K: 2 } */
  },
  geocoding: false
}
