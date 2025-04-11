/* eslint-disable no-extra-boolean-cast */
import mongoServer from '../connections'
import fs from 'fs'
import path from 'path'

let collections = {}
const _PATH = `${__dirname}/../list-collections`


fs.readdirSync(_PATH).map(coll => {
  if (coll !== 'index.js') {
    // console.log('>>', coll)
    const requireFiles = require(`${_PATH}/${coll}`)
    if(!!requireFiles.clsName && typeof requireFiles.clsName !== 'string') {
      console.log(`Collection ${coll} couldn'\t be parse, cause collection name is not define.`)
      return null
    } else if(!!requireFiles.attributes && typeof requireFiles.attributes !== 'object') {
      console.log(`Collection ${coll} couldn'\t be parse, cause attributes is not define.`)
      return null
    }
    let schemaData = new mongoServer.Schema(requireFiles.attributes)
    if(typeof requireFiles.unique === 'object' && (requireFiles.unique || 0).length > 0) {
      for(let x in requireFiles.unique) {
        const itemUniq = requireFiles.unique[x]
        schemaData.index(itemUniq, { unique: true })
      }
    }
    collections[requireFiles.clsName] = mongoServer.model(requireFiles.clsName, schemaData)
    console.log('\x1b[32m', `[INFO] : Register collection ${requireFiles.clsName}.`)
    console.log('\x1b[0m')
  }
})


module.exports = collections

