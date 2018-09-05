import defaultState from '../state'
import { GEOCODE_RECEIVE } from '../actions/file'

export default (state = defaultState.mapParams, action) => {
  switch (action.type) {
    case GEOCODE_RECEIVE:
      if (!action.row || !action.geom) return state
      return {
        ...state,
        center: [action.geom.location.lat, action.geom.location.lng],
        bounds: [
          [action.geom.viewport.northeast.lat, action.geom.viewport.northeast.lng],
          [action.geom.viewport.southwest.lat, action.geom.viewport.southwest.lng]
        ]
      }

    default:
      return state
  }
}
