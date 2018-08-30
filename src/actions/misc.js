export const KEY_SET = 'KEY_SET'
export const KEY_SAVE = 'KEY_SAVE'
export const GEOCODING = 'GEOCODING'
export const IDLE = 'IDLE'

export function setKey (key) {
  return {
    type: KEY_SET,
    key
  }
}
export function saveKey (key) {
  try {
    window.localStorage.setItem('gmapiKey', key)
  } catch (err) {
    console.log('cannot write to localstorage')
  }
  return {
    type: KEY_SAVE,
    key
  }
}

export function setGeocoding () {
  return {
    type: GEOCODING
  }
}
export function setIdle () {
  return {
    type: IDLE
  }
}
