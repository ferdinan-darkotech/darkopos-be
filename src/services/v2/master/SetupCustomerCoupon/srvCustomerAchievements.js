import moment from 'moment'
import db from '../../../../models/tableR'
import dbv from '../../../../models/viewR'
import { setDefaultQuery } from '../../../../utils/setQuery'
import sequelize from '../../../../native/sequelize'

const tbCustAchievements = db.tbl_customer_achievements
const tbCustAchievementsProd = db.tbl_customer_achievements_product
const tbCustAchievementsServ = db.tbl_customer_achievements_service
const vwCustAchievements = dbv.vw_customer_achievements
const vwCustAchievementsProd = dbv.vw_customer_achievements_product
const vwCustAchievementsServ = dbv.vw_customer_achievements_service

const attrCustAchievements = [
  'ho_id', 'ho_code', 'ho_name', 'member_type_id', 'member_type_code', 'member_type_name',
  'status', 'created_by', 'created_at', 'updated_by', 'updated_at',
]
const attrCustAchievementsProd = [
  'id', 'achievement_id', 'ho_id', 'ho_code', 'ho_name', 'product_id', 'product_code', 'product_name',
  'qty_sales', 'point_receive', 'status', 'created_by', 'created_at', 'updated_by', 'updated_at'
]
const attrCustAchievementsServ = [
  'id', 'achievement_id', 'ho_id', 'ho_code', 'ho_name', 'service_id', 'service_code', 'service_name',
  'qty_sales', 'point_receive', 'status', 'created_by', 'created_at', 'updated_by', 'updated_at'
]

// Local Function
function insertCustAchievements (data, info, transaction) {
  return tbCustAchievements.create({
    ho_id: info.ho_id,
    member_type_id: data.member_type_id,
    created_by: info.user,
    created_at: info.time
  }, { transaction, raw: true, returning: ['*'] })
}

function insertCustAchievementsProd (data, info, transaction) {
  let newData = data.map(x => ({
    ho_id: info.ho_id,
    achievement_id: info.achievement_id,
    product_id: x.product_id,
    qty_sales: 1,
    point_receive: x.point_receive,
    created_by: info.user,
    created_at: info.time
  }))
  
  return tbCustAchievementsProd.bulkCreate(newData, { transaction })
}

function insertCustAchievementsServ (data, info, transaction) {
  let newData = data.map(x => ({
    ho_id: info.ho_id,
    achievement_id: info.achievement_id,
    service_id: x.service_id,
    qty_sales: 1,
    point_receive: x.point_receive,
    created_by: info.user,
    created_at: info.time
  }))
  return tbCustAchievementsServ.bulkCreate(newData, { transaction })
}

function editCustAchievements (data, info, transaction) {
  return tbCustAchievements.update({
    ...(typeof data.status === 'boolean' ? { status: data.status } : {}),
    updated_by: info.user,
    updated__at: info.time
  }, { where: { id: info.achievement_id } }, { transaction, raw: true, returning: ['*'] })
}

async function editCustAchievementsProd (data, info, transaction) {
  let newDataInserted = []

  for(let x in data) {
    const items = data[x]

    const currEdited = await tbCustAchievementsProd.update({
      // qty_sales: items.qty_sales,
      point_receive: items.point_receive,
      ...(typeof items.status === 'boolean' ? { status: items.status } : {}),
      updated_by: info.user,
      updated_at: info.time
    }, { where: { achievement_id: info.achievement_id, product_id: items.product_id } }, { transaction, raw: true, returning: ['*'] })

    if(currEdited[0] === 0) {
      newDataInserted.push({
        ho_id: info.ho_id,
        achievement_id: info.achievement_id,
        product_id: items.product_id,
        qty_sales: 1,
        point_receive: items.point_receive,
        created_by: info.user,
        created_at: info.time
      })
    }
  }
  
  await tbCustAchievementsProd.bulkCreate(newDataInserted, { transaction })
}

async function editCustAchievementsServ (data, info, transaction) {
  let newDataInserted = []

  for(let x in data) {
    const items = data[x]

    const currEdited = await tbCustAchievementsServ.update({
      // qty_sales: items.qty_sales,
      point_receive: items.point_receive,
      ...(typeof items.status === 'boolean' ? { status: items.status } : {}),
      updated_by: info.user,
      updated_at: info.time
    }, { where: { achievement_id: info.achievement_id, service_id: items.service_id } }, { transaction, raw: true, returning: ['*'] })

    if(currEdited[0] === 0) {
      newDataInserted.push({
        ho_id: info.ho_id,
        achievement_id: info.achievement_id,
        service_id: items.service_id,
        qty_sales: 1,
        point_receive: items.point_receive,
        created_by: info.user,
        created_at: info.time
      })
    }
  }
  
  await tbCustAchievementsServ.bulkCreate(newDataInserted, { transaction })
}

// Global Function

export function srvGetSomeCustAchievements (query = {}) {
  const { ho_id, ...other } = query
  let queryDefault = setDefaultQuery(attrCustAchievements, other, true)
  queryDefault.where = {
    ...queryDefault.where,
    ho_id
  }
  return vwCustAchievements.findAndCountAll({
    attributes: ['id', ...attrCustAchievements],
    ...queryDefault,
    raw: true
  })
}

export function srvGetOneCustAchievementsByType (ho_id, member_type_code) {
  return vwCustAchievements.findOne({
    attributes: ['id', ...attrCustAchievements],
    where: { ho_id, member_type_code },
    raw: true
  })
}

export function srvGetOneCustAchievementsById (_id) {
  return vwCustAchievements.findOne({
    attributes: ['id', ...attrCustAchievements],
    where: { id: _id },
    raw: true
  })
}

export function srvGetAllCustAchievementsProdByAchieveId (_id, mode = 'mf') {
  return vwCustAchievementsProd.findAll({
    attributes: mode === 'mf' ? attrCustAchievementsProd : [
      'product_code', 'product_name', 'qty_sales', 'point_receive'
    ],
    where: { achievement_id: _id, status: { $eq: true } },
    raw: true
  })
}

export function srvGetAllCustAchievementsServByAchieveId (_id, mode = 'mf') {
  return vwCustAchievementsServ.findAll({
    attributes: mode === 'mf' ? attrCustAchievementsServ : [
      'service_code', 'service_name', 'qty_sales', 'point_receive'
    ],
    where: { achievement_id: _id, status: { $eq: true } },
    raw: true
  })
}

export async function srvCreateCustomerAchievements (data, userInfo) {
  const { detail_product, detail_service, ...otherData } = data
  const transaction = await sequelize.transaction()
  let infoData = {
    ho_id: otherData.ho_id,
    time: moment(),
    user: userInfo.userid
  }
  try {
    const createdAchieve = await insertCustAchievements(otherData, infoData, transaction)

    infoData.achievement_id = createdAchieve.id
    console.log(detail_product)
    await insertCustAchievementsProd(detail_product, infoData, transaction)
    await insertCustAchievementsServ(detail_service, infoData, transaction)
    
    await transaction.commit()
    return { message: 'Customer Achievements has been created.', success: true }
  } catch (er) {
    console.log(er)
    await transaction.rollback()
    return { message: 'Fail to create Customer Achievements', success: false }
  }
}



export async function srvUpdateCustomerAchievements (data, userInfo) {
  const { detail_product, detail_service, ...otherData } = data
  const transaction = await sequelize.transaction()
  let infoData = {
    ho_id: otherData.ho_id,
    achievement_id: data.achieve_id,
    time: moment(),
    user: userInfo.userid
  }
  try {
    const createdAchieve = await editCustAchievements(otherData, infoData, transaction)

    await editCustAchievementsProd(detail_product, infoData, transaction)
    await editCustAchievementsServ(detail_service, infoData, transaction)

    await transaction.commit()
    return { message: 'Customer Achievements has been updated.', success: true }
  } catch (er) {
    console.log(er)
    await transaction.rollback()
    return { message: 'Fail to update Customer Achievements', success: false }
  }
}