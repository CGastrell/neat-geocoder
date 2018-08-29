import rootReducer from '../reducers'
import initialState from '../state'

import { createStore, applyMiddleware, compose } from 'redux'

import thunk from 'redux-thunk'

import { createLogger } from 'redux-logger'

const logger = createLogger({ collapsed: true })
const enhancers = []
const middleware = [ thunk ]

if (process.env.NODE_ENV === 'development') {
  const devToolsExtension = window.devToolsExtension

  if (typeof devToolsExtension === 'function') {
    enhancers.push(devToolsExtension())
  }

  middleware.push(logger)
}

const composedEnhancers = compose(
  applyMiddleware(...middleware),
  ...enhancers
)

const store = createStore(
  rootReducer,
  initialState,
  composedEnhancers
)

export default store
