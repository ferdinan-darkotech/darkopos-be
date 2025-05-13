import tb from '../../../../models/tableR'
import vw from '../../../../models/viewR'
import { ApiError } from '../../../../services/v1/errorHandlingService'
import { getSelectOrder } from '../../../../native/nativeUtils'
import sequelize from '../../../../native/sequelize'
import { Op, remapFilter } from '../../../../native/sequelizeOp'
import { isEmptyObject, checkJSONNested } from '../../../../utils/operate/objOpr'
import { switchModeField } from '../../function/srvUtils'
import { srvGetCityByCode } from '../general/srvCity'
import { srvGetCustomerGroupByCode } from './srvCustomerGroup'
import { srvCreateDataMemberLov, srvGetDataMemberLovByID } from './srvCustomerLov'
import { srvGetCustomerTypeByCode } from './srvCustomerType'
import moment from 'moment'
import { Op as OpSequelize } from 'sequelize'

const table = tb.tbl_member
const view = vw.vw_member
const vwVerifyMember = vw.vw_member_verify

const idField = ['id']
const lovFields01 = [
  ['memberCode', 'value'],
  ['memberName', 'key']
]
const minFields01 = [
  'memberCode',
  'memberName',
  'verifications',
  'npwp_address'
]
const mainFields = [
  'id', 'memberCode', 'memberName', 'address01', 'address02', 'cityCode', 'cityName', 'email', 'state',
  'zipcode', 'mobileNumber', 'phoneNumber', 'idType', 'idNo', 'birthDate', 'gender', 'taxId', 'cashback',
  'memberTypeCode', 'memberTypeName', 'showAsDiscount', 'memberSellPrice', 'memberGroupCode', 'memberGroupName',
  'createdBy', 'createdAt', 'updatedBy', 'updatedAt', 'membercategorycode', 'membercategoryname',
  'prov_nama', 'kab_nama', 'kec_nama', 'kel_nama', 'kel_id', 'active', 'verifications', 'npwp_address',
  'dept_id', 'dept_code', 'dept_name', 'branch_id', 'branch_name', 'verification_status', 'verif_request_at',
  'verif_approved_at', 'referralcode' // [ITCF MEMBER]: FERDINAN - 2025-04-21
]
const mainViewFields = [
  'memberCode', 'memberName', 'address01', 'address02', 'cityName', 'state', 'zipCode',
  'mobileNumber', 'phoneNumber', 'idType', 'idNo', 'birthDate', 'gender', 'taxId', 'cashback',
  'createdBy', 'createdAt', 'updatedBy', 'updatedAt', 'verifications', 'npwp_address',
  'dept_code', 'dept_name', 'branch_name', 'referralcode' // [ITCF MEMBER]: FERDINAN - 2025-04-21
]

const attrMemberVerify = [
  'member_store_code',
  'member_store_name',
  'member_code',
  'member_name',
  'group_name',
  'app_code',
  'verify_id',
  'verify_at'
]

let detailMsg = [
  { title: 'Please provide city', detail: [{ code: 'ZSCL-0001', message: 'No city'}] },
  { title: 'Please provide correct city', detail: [{ code: 'ZSCL-0002', message: 'Not correct city'}] },
  { title: 'Please provide member group', detail: [{ code: 'ZSCL-0003', message: 'No member group'}] },
  { title: 'Please provide correct member group', detail: [{ code: 'ZSCL-0004', message: 'Not correct member group'}] },
  { title: 'Please provide member type', detail: [{ code: 'ZSCL-0005', message: 'No member type'}] },
  { title: 'Please provide correct member type', detail: [{ code: 'ZSCL-0006', message: 'Not correct member type'}] },
  { title: 'Please provide id type', detail: [{ code: 'ZSCL-0007', message: 'No id type'}] },
  { title: 'Please provide id no', detail: [{ code: 'ZSCL-0008', message: 'No id no'}] },
]
let city = { id: null }
let group =  { id: null }
let type =  { id: null }


export function srvGetOneVerifiedCustomerByWA (waNo) {
  return vwVerifyMember.findOne({
    attributes: ['member_code', 'member_name'],
    where: {
      verify_id: waNo,
      app_code: 'WA'
    },
    raw: true
  })
}

export function srvGetVerifiedCustomerByWA (waNo) {
  return vwVerifyMember.findAll({
    attributes: attrMemberVerify,
    where: {
      verify_id: waNo,
      app_code: 'WA'
    },
    raw: true
  })
}

export function srvGetListOfVerifiedMember (query) {
  const { from, to, ...other } = query
  const newFrom = moment(from).format('YYYY-MM-DD')
  const newTo = moment(to).format('YYYY-MM-DD')
  return vwVerifyMember.findAll({
    attributes: attrMemberVerify,
    where: {
      verify_at: { [OpSequelize.between]: [newFrom, newTo] }
    },
    raw: false
  })
}

export async function srvGetCustomers (query, filter = false) {
  let { pageSize, page, order, q, qType, ...other } = query
  let sort = (order) ? getSelectOrder(order) : null
  let where = {} // let where = { deletedAt: { [OpSequelize.eq]: null } }
  const { m, activeOnly, ...condition } = other
  const includeActive = (activeOnly || '').toString() === 'true' ? { active: true } : {}
  if (filter && !isEmptyObject(condition)) {
    where = [...remapFilter(condition), includeActive]
  } else if (!!q && !!qType) {
    where = { [qType]: { [OpSequelize.iRegexp]: q }, ...includeActive }
  } else {
    where = { ...includeActive }
  }

  let modeField = 'min'
  let limitQuery = Number(page) !== 0 ? {
    limit: parseInt(pageSize || 10, 10),
    offset: parseInt(page - 1 || 0, 0) * parseInt(pageSize || 10, 10)
  } : {}

  if (m) {
    const mode = m.split(',')
    // if (mode.includes('mf')) modeField = 'main'
    if (['mf','f1'].some(el => mode.includes(el))) modeField = 'main'
    if (mode.includes('bf')) modeField = 'brow'
    if (mode.includes('ar')) limitQuery = {}
    if (mode.includes('lov')) { modeField = 'lov'; limitQuery = {}; sort = [] }

    const whereExcept01 = { [OpSequelize.or]: { memberName: { [OpSequelize.notRegexp] : 'CUSTOMER|UMUM' }, memberCode: 'CU00000001' } }
    if (mode.includes('f1')) {
      if (where !== 'undefined') {
        where = { [OpSequelize.and]: [ where[0], whereExcept01, includeActive ] }
      } else {
        where = { [OpSequelize.and]: [ whereExcept01, includeActive ] }
      }
    }
  }
  let attributes = minFields01
  switch (modeField) {
    case 'main': attributes = [...mainFields, 'storerelationid']; break
    case 'brow': attributes = mainViewFields; break
    case 'min': attributes = minFields01; break
    case 'lov': attributes = lovFields01; break
    default: attributes = minFields01
  }

  return view.findAndCountAll({
    attributes,
    where,
    // order: sort,
    order: [['id', 'DESC']],
    ...limitQuery,
    raw: false
  })
}

export async function srvGetCustomerByCode (memberCode, query = {}) {
  let { pageSize, page, order, q, ...other } = query
  let attributes = minFields01
  let where = { memberCode }
  const modeField = switchModeField(other)

  switch (modeField) {
    case 'main': attributes = mainFields; break
    case 'brow': attributes = mainViewFields; break
    case 'min': attributes = minFields01; break
    case 'getid': attributes = idField; break
    default: attributes = minFields01
  }

  // if sdel = show deleted row
  // if (modeField === 'sdel') delete where.deletedAt
  if (attributes === idField) {
    return table.findOne({
      attributes,
      where,
      raw: false
    })
  } else {
    return view.findOne({
      attributes,
      where,
      raw: false
    })
  }

}

export async function srvGetCustomerById (id) {
  return table.findOne({
    attributes: minFields01,
    where: { id },
    raw: false
  })
}

export async function srvGetOneCustomerByCode (code) {
  return table.findOne({
    attributes: [ 'memberCode', 'id', 'verifications'],
    where: { memberCode: code },
    raw: false
  })
}

export function srvCustomerExist (groupCode) {
  return srvGetCustomerByCode(groupCode).then(data => {
    if (data == null) {
      return false
    }
    else {
      return true
    }
  })
}

const validateColumns = async function (data, next) {
  // if (data.hasOwnProperty('cityCode')) {
  //   city = await srvGetCityByCode(data.cityCode, { m: 'gid' })
  //   if (!city) {
  //     next(new ApiError(422, detailMsg[1].title, detailMsg[1].detail))
  //   }
  // } else {
  //   next(new ApiError(422, detailMsg[0].title, detailMsg[0].detail))
  // }

  if (data.hasOwnProperty('memberGroupCode')) {
    group = await srvGetCustomerGroupByCode(data.memberGroupCode, { m: 'gid' })
    if (!group) {
      next(new ApiError(422, detailMsg[3].title, detailMsg[3].detail))
    }
  } else {
    next(new ApiError(422, detailMsg[2].title, detailMsg[2].detail))
  }

  if (data.hasOwnProperty('memberTypeCode')) {
    type = await srvGetCustomerTypeByCode(data.memberTypeCode, { m: 'gid' })
    if (!type) {
      next(new ApiError(422, detailMsg[5].title, detailMsg[5].detail))
    }
  } else {
    next(new ApiError(422, detailMsg[4].title, detailMsg[4].detail))
  }
  if (!data.idType) next(new ApiError(422, detailMsg[6].title, detailMsg[6].detail))
  // if (!data.idNo) next(new ApiError(422, detailMsg[7].title, detailMsg[7].detail)) // [NEW]: MASTER - CUSTOMER LIST
}


async function onAddMemberBranchLov (data = {}, transaction = null) {
  try {
    if(!data.branch) return {}
    if(['number', 'string'].indexOf(typeof data.branch_id) !== -1) {
      const currBranch = srvGetDataMemberLovByID('BRANCH', +data.branch_id)
      if(!currBranch) throw new Error('Branch is not define.')

      return currBranch
    }
    return srvCreateDataMemberLov({
      lov_type: 'BRANCH',
      lov_desc: data.branch.toUpperCase(),
      user: data.createdBy
    }, transaction)
  } catch (er) {
    throw er
  }
}


export async function srvCreateCustomer (data, createdBy, next) {
  const transaction = await sequelize.transaction()
  try {
    await validateColumns(data, next)
    const memberBranch = await onAddMemberBranchLov({ ...data, createdBy }, transaction)

    const created = await table.create({
      memberCode: data.memberCode,
      memberName: data.memberName,
      memberGroupId: group.id,
      memberTypeId: type.id,
      membercategoryid: data.membercategoryid,
      idType: data.idType,
      idNo: data.idNo,
      address01: data.address01,
      address02: data.address02,
      kelid: data.kelid,
      memberstoreid: data.memberstoreid,
      // cityId: city.id,
      // state: data.state,
      // zipCode: data.zipCode,
      mobileNumber: data.mobileNumber,
      phoneNumber: data.phoneNumber,
      dept_id: data.dept_id,
      branch_id: memberBranch.lov_id,
      npwp_address: data.npwp_address,
      email: data.email,
      birthDate: data.birthDate,
      gender: data.gender,
      taxId: data.taxId,
      active: data.active,
      verifications: (data.verifications || {}),
      createdBy: createdBy,
      createdAt: moment(),
      verification_status: data.verification_status,
      verif_request_at: data.verif_request_at,
      verif_approved_at: data.verif_approved_at,

      // [ITCF MEMBER]: FERDINAN - 2025-04-21
      referralcode: data.referralcode
    }, { transaction })
    await transaction.commit()

    return created
  } catch (err) {
    await transaction.rollback()
    const { parent, original, sql, ...other } = JSON.parse(JSON.stringify(err))
    other.code = 'ZSCL-00001'
    next(new ApiError(400, other, err))
  }
}

export async function srvUpdateCustomer (data, updatedBy, next) {
  const transaction = await sequelize.transaction()
  try {
    await validateColumns(data, next)
    const memberBranch = await onAddMemberBranchLov({ ...data, createdBy: updatedBy }, transaction)
    
    await validateColumns(data, next)
    const updated = await table.update({
      memberName: data.memberName,
      memberGroupId: group.id,
      memberTypeId: type.id,
      membercategoryid: data.membercategoryid,
      idType: data.idType,
      idNo: data.idNo,
      address01: data.address01,
      address02: data.address02,
      kelid: data.kelid,
      dept_id: data.dept_id,
      branch_id: memberBranch.lov_id,
      npwp_address: data.npwp_address,
      active: data.active,
      // cityId: city.id,
      // state: data.state,
      // zipCode: data.zipCode,
      mobileNumber: data.mobileNumber,
      phoneNumber: data.phoneNumber,
      verifications: (data.verifications || {}),
      email: data.email,
      birthDate: data.birthDate,
      gender: data.gender,
      taxId: data.taxId,
      updatedBy: updatedBy,
      updatedAt: moment(),
      verification_status: data.verification_status,
      verif_request_at: data.verif_request_at,
      verif_approved_at: data.verif_approved_at,

      // [ITCF MEMBER]: FERDINAN - 2025-04-21
      referralcode: data.referralcode
    }, {
      where: {
        memberCode: data.code
      }
    })
    await transaction.commit()

    return updated
  } catch (err) {
    await transaction.rollback()
    const { parent, original, sql, ...other } = JSON.parse(JSON.stringify(err))
    other.code = 'ZSCL-00001'
    next(new ApiError(400, other, err))
  }
}

export function srvDeleteCustomer (memberCode, next) {
  return table.destroy({
    where: { memberCode }
  }).catch(err => {
    const { parent, original, sql, ...other } = JSON.parse(JSON.stringify(err))
    other.code = 'ZSCL-00003'
    next(new ApiError(400, err, err))
  })
}

export async function srvGetMemberCode (mn) {
  try {
    const result = await table.findOne({
      attributes: ['memberCode'],
      where: { mobileNumber: mn }
    });

    return result ? result.memberCode : null;
  } catch (error) {
    console.error('Couldn\'t find member code : ', error);
    throw error;
  }
}

export async function srvGetStatsVerified (mn, mc) {
  try {
    const verif = await table.findOne({
      attributes: ['verifications'],
      where: {
        mobileNumber: mn,
        memberCode: mc
      },
      raw: true
    });

    return verif ? verif.verifications : null;
  } catch (error) {
    console.error('Couldn\'t find verifications : ', error);
    throw error;
  }
}

export async function srvReVerify(data, next) {
  const transaction = await sequelize.transaction()
  try {
    const reverif = await table.update({
      verifications: data.verifications,
      verification_status: data.verification_status,
      verif_request_at: data.verif_request_at,
      verif_approved_at: data.verif_approved_at
    }, {
      where: {
        mobileNumber: data.number,
        memberCode: data.code
      }
    })
    await transaction.commit()

    return reverif
  } catch (err) {
    await transaction.rollback()
    const { parent, original, sql, ...other } = JSON.parse(JSON.stringify(err))
    other.code = 'ZSCL-00001'
    next(new ApiError(400, other, err))
  }
}

export async function srvFixVerify (no, mc) {
  try {
    const fixed = await table.findOne({
      attributes: [
        'verifications',
        'verification_status',
        'verif_request_at',
        'verif_approved_at'
      ],
      where: {
        mobileNumber: no,
        memberCode: mc
      },
      raw: true
    });

    return fixed
  } catch (error) {
    console.error('Couldn\'t Fix Verification : ', error);
    throw error;
  }
}
