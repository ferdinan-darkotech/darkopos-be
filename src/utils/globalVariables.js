var state = {}


function setVariables (key, values) {
  try {
    state[key] = values
    return { success: true, data: values }
  } catch (er) {
    throw er
  }
}

function getVariables (key) {
  try {
    if(Object.keys(state).indexOf(key) === -1) {
      throw new Error(`Cannot find variables ${key}.`)
    }

    return { success: true, data: state[key] }
  } catch (er) {
    return { success: false, data: null }
  }
}

function getListKeys () {
  return Object.keys(state)
}

function dropVariables (key) {
  if(Object.keys(state).indexOf(key) !== -1) {
    delete state[key]
  }
  return { success: true, key }
}

module.exports = {
  setVariables,
  getListKeys,
  getVariables,
  dropVariables
}