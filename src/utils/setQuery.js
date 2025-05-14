import sequelize from 'sequelize'
import moment from 'moment'
import { isArray } from 'lodash'

const Op = sequelize.Op

export function generateCode (pref, format, tail = 1, seperate = '-') {
  let tailPref = ''
  for(let i=0;i<tail;i+=1) {
    tailPref += Math.round((Math.random(0, 9) * 100) % 9).toString()
  }

  return `${pref}${seperate}${moment().format(format)}${seperate}${tailPref}`
}

export function setDefaultQuery (attributes = [], query = {}, paging) {
  // using duration filter as : _DURATION@{format type} = [int, int]
  
  const { page, pageSize, _DurationItem = [], ...others } = query
  const filtered = Object.getOwnPropertyNames(others || {}) || []
  let where = {}
  let limitQuery = {}
  filtered.map(item => {
    const itemRegex = item.split('@')[0]
    if(attributes.indexOf(itemRegex) !== -1) {
      if(item === 'createdat' || item === 'updatedat' || item.indexOf('@D') !== -1) { // Date Format : @D
        where[itemRegex] = { [Op.between]: query[item] }
      } else if (item.indexOf('@FI') !== -1) { // Find In, using seperator "," : @FI 
        where[itemRegex] = { [Op.in]: (query[item] || '').split(',') }
      } else if (item.indexOf('@IN') !== -1 && isArray(query[item])) {
        let tmpItems = []
        for(let z in query[item]) {
          const dataItems = query[item][z]
          tmpItems.push({ [Op.eq]: dataItems })
        }
        where[itemRegex] = { [Op.or]: tmpItems }
      } else { // Normal Query 
        where[itemRegex] = { [Op.iRegexp]: `${query[item]}` }
      }
    } else if (item.indexOf('_DURATION') !== -1) { // Range Duration beetween date or time
      const pref = (item.split('@')[1] || '')
      where[''] = sequelize.literal(`sch_pos.datetimediff(${_DurationItem[0]}, ${_DurationItem[1]}, '${pref}') between ${query[item][0]} and ${query[item][1]}`) // postgres
    }
    return
  })

  if(paging) {
    limitQuery = {
      limit: +(query.pageSize || 10),
      offset: +(query.page - 1 || 0) * +(query.pageSize || 10)
    }
  }

  return { where, ...limitQuery }
}

export function setDefaultQueryNoSQL (attributes = [], query = {}, pagings) {
  let where = {}
  let tmpWhere = {}
  let attr = null
  let paging = { page: null, pageSize: null }
  const { page, pageSize, ...others } = query
  const filtered = Object.getOwnPropertyNames(others || {}) || []

  filtered.map(items => {
    let tmpItem = items || ''
    attr = tmpItem
    tmpWhere = {}
    
    if(!!tmpItem.match(/\$[RNGDT]+/g)) { // check if item is contains Range Date
      attr = tmpItem.split(':')[1]
      const fromDate = others[tmpItem][0] || ''
      const toDate = others[tmpItem][1] || ''
      if(attr) {
        tmpWhere = { [attr]: { [Op.gte]: new Date(moment(fromDate)), [Op.lte]: new Date(moment(toDate)) } }
      }
    } else if (!!tmpItem.match(/\$[PERIOD]+/g)) { // check if item is contains Single Period
      attr = tmpItem.split(':')[1]
      const fromDate = others[tmpItem] ? new Date(moment(others[tmpItem]).startOf('month')) : null
      const toDate = others[tmpItem] ? new Date(moment(others[tmpItem]).endOf('month')) : null
      tmpWhere = { [attr]: { [Op.gte]: new Date(moment(fromDate).startOf('day')), [Op.lte]: new Date(moment(toDate).endOf('day')) } }
    } else if (!!tmpItem.match(/\$[BOOL]+/g)) { // check if item is contains Boolean
      attr = tmpItem.split(':')[1]
      const trueStatus = (others[tmpItem] || '').match(/Y/g) ? [true] : []
      const falseStatus = (others[tmpItem] || '').match(/N/g) ? [false] : [] 
      tmpWhere = { [attr]: { [Op.in]: [...trueStatus, ...falseStatus] } }
    } else {
      const newVal = (others[tmpItem] || '').replace(/(\(|\{|\[).*/g, '')
      tmpWhere = { [attr]: { [Op.regexp]: new RegExp(`${newVal}`, 'i') } }
    }

    if(attributes.indexOf(attr) !== -1) {
      where = {
        ...where,
        ...tmpWhere
      }
    }
  })

  // console.log('AAA :', where)
  if(pagings) {
    paging = {
      limit: +(pageSize || 20),
      offset: +(page - 1 || 0) * +(pageSize || 20)
    }
  }

  return { where, paging }
}

export function buildAttributesOfNoSql (mainAttr = [], secondAttr = [], excludeAdditionalVar = false) {
  let newAttr = {}
  for(let x in mainAttr) {
    const items = mainAttr[x]
    if(secondAttr.indexOf(items) === -1) {
      newAttr[items] = 0
    }
  }

  if(excludeAdditionalVar) {
    return {
      ...newAttr,
      _id: 0,
      __v: 0
    }
  }
  return newAttr
}