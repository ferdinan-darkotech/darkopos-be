import moment from 'moment'
import db from '../../../../models/tableR'
import dbv from '../../../../models/viewR'
import { setDefaultQuery } from '../../../../utils/setQuery'
import sequelize from '../../../../native/sequelize'

const tbCustRewards = db.tbl_customer_rewards
const tbCustRewardsProd = db.tbl_customer_rewards_product
const tbCustRewardsServ = db.tbl_customer_rewards_service
const vwCustRewards = dbv.vw_customer_rewards
const vwCustRewardsProd = dbv.vw_customer_rewards_product
const vwCustRewardsServ = dbv.vw_customer_rewards_service

const attrCustRewards = [
  'ho_id', 'ho_code', 'ho_name', 'member_type_id', 'member_type_code', 'member_type_name',
  'status', 'created_by', 'created_at', 'updated_by', 'updated_at',
]
const attrCustRewardsProd = [
  'id', 'reward_id', 'ho_id', 'ho_code', 'ho_name', 'product_id', 'product_code', 'product_name',
  'qty_receive', 'point_needed', 'status', 'created_by', 'created_at', 'updated_by', 'updated_at'
]
const attrCustRewardsServ = [
  'id', 'reward_id', 'ho_id', 'ho_code', 'ho_name', 'service_id', 'service_code', 'service_name',
  'qty_receive', 'point_needed', 'status', 'created_by', 'created_at', 'updated_by', 'updated_at'
]

// Local Function
function insertCustRewards (data, info, transaction) {
  return tbCustRewards.create({
    ho_id: info.ho_id,
    member_type_id: data.member_type_id,
    created_by: info.user,
    created_at: info.time
  }, { transaction, raw: true, returning: ['*'] })
}

function insertCustRewardsProd (data, info, transaction) {
  let newData = data.map(x => ({
    ho_id: info.ho_id,
    reward_id: info.reward_id,
    product_id: x.product_id,
    qty_receive: 1,
    point_needed: x.point_needed,
    created_by: info.user,
    created_at: info.time
  }))
  
  return tbCustRewardsProd.bulkCreate(newData, { transaction })
}

function insertCustRewardsServ (data, info, transaction) {
  let newData = data.map(x => ({
    ho_id: info.ho_id,
    reward_id: info.reward_id,
    service_id: x.service_id,
    qty_receive: 1,
    point_needed: x.point_needed,
    created_by: info.user,
    created_at: info.time
  }))
  return tbCustRewardsServ.bulkCreate(newData, { transaction })
}

function editCustRewards (data, info, transaction) {
  return tbCustRewards.update({
    ...(typeof data.status === 'boolean' ? { status: data.status } : {}),
    updated_by: info.user,
    updated__at: info.time
  }, { where: { id: info.reward_id } }, { transaction, raw: true, returning: ['*'] })
}

async function editCustRewardsProd (data, info, transaction) {
  let newDataInserted = []

  for(let x in data) {
    const items = data[x]

    const currEdited = await tbCustRewardsProd.update({
      // qty_receive: items.qty_receive,
      point_needed: items.point_needed,
      ...(typeof items.status === 'boolean' ? { status: items.status } : {}),
      updated_by: info.user,
      updated_at: info.time
    }, { where: { reward_id: info.reward_id, product_id: items.product_id } }, { transaction, raw: true, returning: ['*'] })

    if(currEdited[0] === 0) {
      newDataInserted.push({
        ho_id: info.ho_id,
        reward_id: info.reward_id,
        product_id: items.product_id,
        qty_receive: 1,
        point_needed: items.point_needed,
        created_by: info.user,
        created_at: info.time
      })
    }
  }
  
  await tbCustRewardsProd.bulkCreate(newDataInserted, { transaction })
}

async function editCustRewardsServ (data, info, transaction) {
  let newDataInserted = []

  for(let x in data) {
    const items = data[x]

    const currEdited = await tbCustRewardsServ.update({
      // qty_receive: items.qty_receive,
      point_needed: items.point_needed,
      ...(typeof items.status === 'boolean' ? { status: items.status } : {}),
      updated_by: info.user,
      updated_at: info.time
    }, { where: { reward_id: info.reward_id, service_id: items.service_id } }, { transaction, raw: true, returning: ['*'] })

    if(currEdited[0] === 0) {
      newDataInserted.push({
        ho_id: info.ho_id,
        reward_id: info.reward_id,
        service_id: items.service_id,
        qty_receive: 1,
        point_needed: items.point_needed,
        created_by: info.user,
        created_at: info.time
      })
    }
  }
  
  await tbCustRewardsServ.bulkCreate(newDataInserted, { transaction })
}

// Global Function

export function srvGetSomeCustRewards (query = {}) {
  const { ho_id, ...other } = query
  let queryDefault = setDefaultQuery(attrCustRewards, other, true)
  queryDefault.where = {
    ...queryDefault.where,
    ho_id
  }
  return vwCustRewards.findAndCountAll({
    attributes: ['id', ...attrCustRewards],
    ...queryDefault,
    raw: true
  })
}

export function srvGetOneCustRewardsByType (ho_id, member_type_code) {
  return vwCustRewards.findOne({
    attributes: ['id', ...attrCustRewards],
    where: { ho_id, member_type_code },
    raw: true
  })
}

export function srvGetOneCustRewardsById (_id) {
  return vwCustRewards.findOne({
    attributes: ['id', ...attrCustRewards],
    where: { id: _id },
    raw: true
  })
}

export function srvGetAllCustRewardsProdByRewardId (_id, mode = 'mf') {
  return vwCustRewardsProd.findAll({
    attributes: mode === 'mf' ? attrCustRewardsProd : [
      'product_code', 'product_name', 'qty_receive', 'point_needed'
    ],
    where: { reward_id: _id, status: { $eq: true } },
    raw: true
  })
}

export function srvGetAllCustRewardsServByRewardId (_id, mode = 'mf') {
  return vwCustRewardsServ.findAll({
    attributes: mode === 'mf' ? attrCustRewardsServ : [
      'service_code', 'service_name', 'qty_receive', 'point_needed'
    ],
    where: { reward_id: _id, status: { $eq: true } },
    raw: true
  })
}

export async function srvCreateCustomerRewards (data, userInfo) {
  const { detail_product, detail_service, ...otherData } = data
  const transaction = await sequelize.transaction()
  let infoData = {
    ho_id: otherData.ho_id,
    time: moment(),
    user: userInfo.userid
  }
  try {
    const createdReward = await insertCustRewards(otherData, infoData, transaction)

    infoData.reward_id = createdReward.id
    console.log(detail_product)
    await insertCustRewardsProd(detail_product, infoData, transaction)
    await insertCustRewardsServ(detail_service, infoData, transaction)
    
    await transaction.commit()
    return { message: 'Customer Rewards has been created.', success: true }
  } catch (er) {
    console.log(er)
    await transaction.rollback()
    return { message: 'Fail to create Customer Rewards', success: false }
  }
}



export async function srvUpdateCustomerRewards (data, userInfo) {
  const { detail_product, detail_service, ...otherData } = data
  const transaction = await sequelize.transaction()
  let infoData = {
    ho_id: otherData.ho_id,
    reward_id: data.reward_id,
    time: moment(),
    user: userInfo.userid
  }
  try {
    const createdReward = await editCustRewards(otherData, infoData, transaction)
    
    await editCustRewardsProd(detail_product, infoData, transaction)
    await editCustRewardsServ(detail_service, infoData, transaction)

    await transaction.commit()
    return { message: 'Customer Rewards has been updated.', success: true }
  } catch (er) {
    console.log(er)
    await transaction.rollback()
    return { message: 'Fail to update Customer Rewards', success: false }
  }
}