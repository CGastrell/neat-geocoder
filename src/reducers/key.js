import { KEY_SAVE, KEY_SET } from '../actions/misc'
export default (state = '', action) => {
  switch (action.type) {
    case KEY_SET: return action.key
    case KEY_SAVE: return action.key
    default: return state
  }
}
