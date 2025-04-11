import { checkJSONNested } from '../../../utils/operate/objOpr'

const switchModeField = (other) => {
  let modeField = 'min'

  if (checkJSONNested(other,'m')) {
    const mode = other.m.split(',')
    if (mode.includes('mf')) modeField = 'main'
    if (mode.includes('bf')) modeField = 'brow'
    if (mode.includes('min')) modeField = 'min'
    if (mode.includes('lov')) modeField = 'min'
    if (mode.includes('gid')) modeField = 'getid'
    if (mode.includes('sd')) modeField = 'sdel'
  }

  return modeField
}

export {
  switchModeField
}
