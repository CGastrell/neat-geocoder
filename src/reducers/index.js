import { combineReducers } from 'redux'

import file from './file'
import map from './map'
import markers from './markers'
import geocoding from './geocoding'
import key from './key'
const reducer = combineReducers({
  file,
  mapParams: map,
  markers,
  geocoding,
  key
})

export default reducer
