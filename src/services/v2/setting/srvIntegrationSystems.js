import db from '../../../models/tableR'
import { setDefaultQuery } from '../../../utils/setQuery'

const tblIntegration = db.tbl_integration_systems

const attributes = {
  mf: [
    'id', 'code', 'key', 'name', 'description', 'value01',
    'value02', 'url', 'api_key', 'active'
  ],
  bf: [
    'key', 'name', 'description', 'value01',
    'value02', 'url', 'api_key', 'active'
  ],
  lov: [
    'name', 'description', 'value01',
    'value02', 'url', 'api_key'
  ]
}


export function srvGetAllIntegrationSystems (query) {
  const { m, ...other } = query
  let tmpAttrs = attributes[m || 'lov'] || attributes['lov']
  let queryDefault = setDefaultQuery(tmpAttrs, other, m !== 'lov')
  return tblIntegration.findAndCountAll({
    attributes: tmpAttrs,
    ...queryDefault,
    raw: true
  })
}

export function srvGetSomeIntegrationSystems (code = null) {
  return tblIntegration.findAll({
    attributes: attributes.bf,
    where: { code },
    raw: true
  })
}

export function srvGetOneIntegrationSystems (code = null, key) {
  return tblIntegration.findOne({
    attributes: attributes.lov,
    where: { code, key, active: { $eq: true } },
    raw: true
  })
}