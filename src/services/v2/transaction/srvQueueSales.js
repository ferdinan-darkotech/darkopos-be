import dbv from '../../../models/viewR'
import db from '../../../models/tableR'
import moment, { now } from 'moment'
import cryptojs from 'crypto-js'
import sequelize from '../../../native/sequelize'
import { getNativeQuery } from '../../../native/nativeUtils'
import { setDefaultQuery } from '../../../utils/setQuery'
import { getStoreQuery } from '../../../services/setting/storeService'
import { srvInsertTrackCustomerTrans, srvInsertQueueActivity } from './srvTrackSales'
import { insertData as insertDataWo } from '../../service/workorder/woMainService'
import { Op } from 'sequelize'

const tblQueueSales = db.tbl_tmp_pos
const tblQueueSalesDetail = db.tbl_tmp_pos_detail
const tblQueueSalesMisc = db.tbl_tmp_pos_misc
const vwQueueSales = dbv.vw_queue_pos
const vwQueueList = dbv.vw_list_queue
const vwQueueApproval = dbv.vw_queue_approval
const vwMonitSPK = dbv.vw_monitoring_spk
const vwHistoryWO = dbv.vw_history_workorder
const vwQueueCancel = dbv.vw_cancel_queue_sales

const salesMisc = ['member', 'bundle', 'voucher', 'employee', 'wo', 'unit']
const queueApproval = ['headerid','member','unit','queuenumber','storeid','storecode','storename','productid','productcode','productname',  'typecode',
'categorycode','categoryname','max_disc','qty','price','sellingPrice','discountLoyalty','discount','disc1','disc2','disc3', 'intersales', 'history_member',
'membername', 'sellingprice', 'max_disc_nominal', 'total','createdBy','createdAt','updatedBy','updatedAt','appdata','appmemo','appstatus','appby','appdt']

const queueSalesAttr = {
	mf: [ 
		'id', 'queuenumber', 'headerid', 'storeId', 'memberCode', 'memberName', 'taxId', 'memberPendingPayment', 'address01',
		'address02', 'memberSellPrice', 'memberTypeId', 'memberTypeName', 'phone', 'showAsDiscount', 'cashback',
		'gender', 'employeeId', 'employeeCode', 'employeeName', 'woNumber', 'woId', 'woNo', 'bundle_promo',
		'cashier_trans', 'service_detail', 'memberUnit', 'voucherPayment', 'createdBy', 'updatedBy',
		'createdAt', 'updatedAt', 'intersales', 'policeNo', 'timeIn', 'vehicle_km', 'gasoline_percent',
		'customer_confirm', 'mechanics_confirm', 'request_stock_out' // [NEW]: FERDINAN - 2025-03-07
	],
	confirm: [
		'queuenumber', 'customer_confirm', 'mechanics_confirm'
	]
}
const attrQueueList = [
	'woid', 'wono','storeid', 'queuenumber', 'headerid', 'membername', 'policeno', 'createdAt', 'status', 'statustext',
	'total_duplicate', 'current_duplicate', 'request_stock_out' // [NEW]: FERDINAN - 2025-03-07
]
const attrHistoryWO = [
	'woid', 'wono', 'salesid', 'salesno', 'storeid', 'storecode', 'storename',
	'cscode', 'csname', 'cashiercode', 'cashiername', 'memberid', 'membercode',
	'membername', 'policenoid', 'policeno', 'timein', 'timeout'
]

const cancelQueueAttr = [
	'headerid', 'queuenumber', 'woid', 'wono', 'storeid', 'storecode', 'storename', 'memberid', 'membercode', 'membername',
	'employeeid', 'employeecode', 'employeename', 'policeno', 'timein', 'cancelby', 'cancelat', 'memo',
	'current_duplicate', 'total_duplicate'
]

const mappingCreateMisc = (x, info) => ({
	storeid: info.storeid,
	headerid: info.headerid,
	objecttype: x.type,
	dataobject: x.datamisc
})
const mappingCreateDetail = (x, info) => ({
	headerid: info.headerid,
	storeId: info.storeid,
	bundleId: x.bundleId,
	employee: x.employee,
	product: x.product,
	qty: x.qty,
	sellPrice: (x.sellPrice || null),
	sellingPrice: x.sellingPrice,
	discountLoyalty: x.discountLoyalty,
	discount: x.discount,
	disc1: x.disc1,
	disc2: x.disc2,
	disc3: x.disc3,
	price: x.price,
	total: x.total,
	max_disc_percent: x.max_disc_percent,
	max_disc_nominal: x.max_disc_nominal,
	typeCode: x.typeCode,
	voucherCode: x.vouchercode,
	voucherNo: x.voucherno,
	createdBy: info.user,
	createdAt: info.time,
	appdata: x.appdata || false,
	appmemo: x.appmemo,
	appstatus: x.appstatus,
	appdt: x.appdt,
	appby: x.appby,
	indentid: x.indentid,
	customerreward: x.customerReward,
	trade_id: x.trade_in,
	keterangan: x.keterangan || null,

	// [NEW]: FERDINAN - 2025-03-25
	salestype: x.salestype || 'I',
	additionalpricenominal: x.additionalpricenominal || 0,
	additionalpricepercent: x.additionalpricepercent || 0,
	additionalpriceroundingdigit: x.additionalpriceroundingdigit || 0,

	// [EXTERNAL SERVICE]: FERDINAN - 2025-04-22
	transnopurchase: x.transnopurchase || null,

	// [HPP VALIDATION]: FERDINAN - 2025-05-22
	hppperiod: x.hppperiod || '',
	hppprice: x.hppprice || 0,

	// [NO BAN]: FERDINAN - 2025-06-20
	noreference: x.noreference || null
})
/* --------------- LOCAL FUNCTION  ---------------- */ 

function srvCreateQueueSalesHeader (data, info, transaction) {
	return tblQueueSales.create({
		headerid: info.headerid,
		storeId: info.storeid,
		wo: data.wo,
		woNumber: data.woNumber,
		member: data.member,
		unit: data.unit,
		employee: data.employee,
		bundle: data.bundle,
		other_informations: data.otherInformations,
		voucherPayment: data.voucherPayment ? data.voucherPayment : null,
		confirm_id: data.confirm_id,
		createdBy: info.user,
		createdAt: info.time
	}, { transaction })
}

function srvCreateQueueSalesDetail (data, info, transaction) {
	const newData = data.map(x => mappingCreateDetail(x, info))
	return tblQueueSalesDetail.bulkCreate(newData, { transaction })
}

function srvCreateQueueSalesMisc (data, info, transaction) {
	let newData = []
	data.map(x => {
		if(salesMisc.indexOf(x.objecttype) === -1) return
		newData.push(mappingCreateMisc(x, info))
	})

	return tblQueueSalesMisc.bulkCreate(newData, { transaction })
}

function srvUpdateQueueSalesHeader (data, info, transaction) {
	return tblQueueSales.update({
		unit: data.unit,
		bundle: data.bundle,
		woNumber: data.woNumber,
		voucherPayment: data.voucherPayment ? data.voucherPayment : null,
		discountLoyalty: data.discountLoyalty,
		other_informations: data.otherInformations,
		updatedat: info.time,
		updatedby: info.user
	}, { where: { headerid: info.headerid, storeid: info.storeid } }, { transaction })
}

async function srvUpdateQueueSalesDetail (data, info, transaction) {
	let toDeleted = []
	let addData = []
	for (let x in data) {
		toDeleted.push(`('${data[x].product}', '${data[x].typeCode}')`)
		const dataDetail = {
			employee: data[x].employee,
			qty: data[x].qty,
			sellingPrice: data[x].sellingPrice,
			sellPrice: (data[x].sellPrice || null),
			discount: data[x].discount,
			disc1: data[x].disc1,
			disc2: data[x].disc2,
			disc3: data[x].disc3,
			price: data[x].price,
			total: data[x].total,
			bundleId: data[x].bundleId,
			voucherCode: data[x].vouchercode,
			voucherNo: data[x].voucherno,
			max_disc_percent: data[x].max_disc_percent,
			max_disc_nominal: data[x].max_disc_nominal,
			updatedBy: info.user,
			updatedAt: info.time,
			appdata: data[x].appdata || false,
			appmemo: data[x].appmemo,
			appstatus: data[x].appstatus,
			appdt: data[x].appdt,
			appby: data[x].appby,
			indentid: data[x].indentid,
			trade_in: Array.isArray(data[x].trade_in) ? data[x].trade_in : [],
			customerreward: data[x].customerReward,

			// [NEW]: FERDINAN - 2025-03-26
			salestype: data[x].salestype || 'I',
			additionalpricenominal: data[x].additionalpricenominal || 0,
			additionalpricepercent: data[x].additionalpricepercent || 0,
			additionalpriceroundingdigit: data[x].additionalpriceroundingdigit || 0,

			// [EXTERNAL SERVICE]: FERDINAN - 2025-04-22
			transnopurchase: data[x].transnopurchase || null,
			
			// [HPP VALIDATION]: FERDINAN - 2025-05-22
			hppperiod: data[x].hppperiod || '',
			hppprice: data[x].hppprice || 0,

			// [NO BAN]: FERDINAN - 2025-06-20
			noreference: data[x].noreference || null
		}
		if(data[x].action === 'edit') {
			await tblQueueSalesDetail.update(
				dataDetail,
				{ where: { product: data[x].product, typecode: data[x].typeCode, headerid: info.headerid } },
				{ transaction }
			)
		}	else if (data[x].action === 'add') {
			await addData.push(mappingCreateDetail(data[x], info))
		}
	}
	await tblQueueSalesDetail.bulkCreate(addData, { transaction })
	await tblQueueSalesDetail.destroy({ where: { 
		headerid: info.headerid,
		storeid: info.storeid,
		['(product,typecode)']: sequelize.literal(`(product,typecode) not in (${toDeleted.join(',')})`)
	 } }, { transaction })
}

function srvUpdateQueueSalesMisc (data, info, transaction) {
	let addData = []
	return data.map(x => {
		const dataDetail = {
			dataobject: x.datamisc
		}
		if(salesMisc.indexOf(x.objecttype) === -1 || x.objecttype === 'member'
			|| x.objecttype === 'wo' || x.objecttype === 'employee') return

		if(x.typeAction === 'edit') {
			return tblQueueSalesMisc.update(
				dataDetail,
				{ where: { headerid: info.headerid, objecttype: x.objecttype } },
				{ transaction }
			)
		}	else if (x.typeAction === 'add') {
			addData.push(mappingCreateMisc(x, info))
		} else if (x.typeAction === 'delete') {
			tblQueueSalesMisc.destroy({ where: { productid: x.headerid, objecttype: x.objecttype } }, { transaction })
		}

		tblQueueSalesMisc.bulkCreate(addData, { transaction })
	})
}

export function srvGetSalesHeader (headerid) {
	return tblQueueSales.findOne({
		attributes: ['*'],
		where: { headerid },
		raw: true	
	})
}

function srvGetSalesMisc (headerid) {
	return tblQueueSalesMisc.findOne({
		where: { headerid }		
	})
}




/* --------------- GLOBAL FUNCTION  ---------------- */
export function srvGetVoidWO (query, storelist) {
	let tmpQuery = { ...query }
	
	if (query.timein) {
		tmpQuery['timein@D'] = query.timein
		delete tmpQuery.timein
	} else if (query.cancelat) {
		tmpQuery['cancelat@D'] = query.cancelat
		delete tmpQuery.cancelat
	}
	let queryDefault = setDefaultQuery(cancelQueueAttr, tmpQuery, true)
	queryDefault.where = {
		...queryDefault.where,
		storeid: { [Op.in]: storelist.split(',') }
	}

	
	return vwQueueCancel.findAndCountAll({
		attributes: cancelQueueAttr,
		...queryDefault,
		order: ['storecode', 'timein'],
		raw: false
	})
}


export function srvGetHistoryWO (query, storelist) {
	let tmpQuery = { ...query, _DurationItem: ['timein', 'timeout'] }
	
	if (query.timein) {
		tmpQuery['timein@D'] = query.timein
		delete tmpQuery.timein
	} else if (query.timeout) {
		tmpQuery['timeout@D'] = query.timeout
		delete tmpQuery.timeout
	}

	let queryDefault = setDefaultQuery(attrHistoryWO, tmpQuery, true)
	
	queryDefault.where = {
		...queryDefault.where,
		storeid: { [Op.in]: storelist.split(',') }
	}

	
	return vwHistoryWO.findAndCountAll({
		attributes: attrHistoryWO,
		...queryDefault,
		order: ['storecode', 'timein', 'timeout'],
		raw: false
	})
}



export function srvGetDetailQueue (headerid, other = {}) {
	return tblQueueSalesDetail.findAll({
		attributes: ['*'],
		where: { headerid, ...other },
		raw: true
	})
}

export async function srvGetListQueueApproval (query, userid, noClause = false) {
	// const { storeid, ...other } = query
	let queryDefault = setDefaultQuery(queueApproval, {}, false)
	// const filterStore = storeid ? { storeid } : {}
	const accessStore = (JSON.parse(JSON.stringify(await getStoreQuery({ userId: userid }, 'userstorestree')))[0] || {})
	const listAccessStore = (accessStore.userstore || '').split(',')
	
	queryDefault.where = {
		...queryDefault.where,
		...(noClause ? {} : { storecode: { [Op.in]: listAccessStore } })
	}
	return vwQueueApproval.findAll({
		attributes: queueApproval,
		order: ['createdat','updatedat', 'queuenumber'],
		...queryDefault,
		raw: true
	})
}

export function srvGetListQueueByWO (headerid, woid) {
	return vwQueueList.findOne({
		attributes: attrQueueList,
		where: { headerid, woid },
		raw: false
	})
}

export function srvGetListQueueByStore (storeid, query) {
	return vwQueueList.findAll({
		attributes: attrQueueList,
		where: { 
			storeid,
			
			// [SEARCH QUEUE]: FERDINAN - 2025-06-30
			...(query.q ? {
				[Op.or]: [
					{ queuenumber: { [Op.iLike]: `%${query.q}%` } },
					{ memberName: { [Op.iLike]: `%${query.q}%` } },
					{ policeNo: { [Op.iLike]: `%${query.q}%` } }
				]
			} : {})
		},
		order: ['storeid', 'queuenumber', 'createdat','updatedat'], 
		raw: true
	})
}

export function srvGetOneQueueById (headerid) {
	return vwQueueList.findOne({
		attributes: attrQueueList,
		where: { headerid },
		raw: false
	})
}

export function srvGetSomeMainQueueById (_headerid) {
	return vwQueueList.findAll({
		attributes: attrQueueList,
		where: { headerid: { [Op.in]: _headerid } },
		raw: false
	})
}

export function srvGetDataQueue (storeid, headerid, mode = null) {
	return vwQueueSales.findOne({
		attributes: queueSalesAttr[mode] || queueSalesAttr.mf,
		where: { storeid, headerid },
		raw: false
	})
}

export function srvGetSomeDetailQueueById (_headerid) {
	return vwQueueSales.findAll({
		attributes: queueSalesAttr.mf,
		where: { headerid: { [Op.in]: _headerid } },
		raw: false
	})
}

export function srvGetAllDataQueue (storeid = '', type = 'findAll') {
	if (type === 'findAll') {
		return vwMonitSPK.findAndCountAll({
			attributes: ['storeid', 'storecode','storename','listqueue'],
			where: { storeid: { [Op.in]: storeid.split(',') } },
			raw: true
		})
	} else if (type === 'findOne') {
		return vwMonitSPK.findOne({
			attributes: ['storeid', 'storecode','storename','listqueue'],
			where: { storeid: storeid },
			raw: true
		})
	} else {
		return null
	}
}

export async function srvGetApprovalExists (payload) {
	const sSql = `select * from sch_pos.fn_check_queue_exists('${JSON.stringify(payload)}') val;`
	const result = await getNativeQuery(sSql,true, 'RAW', null)
	return result
}

export async function srvInsertQueueSales (_DATA, _SPK = {}, next) {
	const transaction = await sequelize.transaction()
	const { detail, user, storeid, trackSales, orderRequest, ...header } = _DATA
	const generateCode = `Q${storeid}#${moment().format('YYMMDD#hhmmss')}`
	const info = {
		headerid: cryptojs.MD5(generateCode).toString(),
		user,
		time: moment(),
		storeid
	}
	try {
		const checkWO = (_SPK.header || {}).policeNo
		const checkExistsService = detail.filter(x => x.typeCode === 'S')

		// [NEW]: FERDINAN - 2025-03-03
		let spkCreated = {};
		if (!_SPK.header || !_SPK.header.id) {
			spkCreated = checkWO ? await insertDataWo(_SPK, user, transaction, next) : {}
		} else if (_SPK.header.id) {
			spkCreated.success = true
			spkCreated.woid = _SPK.header.id
			spkCreated.wono = _SPK.header.woNo
		}

		// [NEW]: FERDINAN - 2025-03-03
		// const spkCreated = checkWO ? await insertDataWo(_SPK, user, transaction, next) : {}

		let headerCreated
		
		if(spkCreated.success || checkExistsService.length === 0) {
			let confirmId = null
			if(typeof trackSales === 'object' && !!trackSales) {
				const confirmFlow = await srvInsertTrackCustomerTrans(trackSales, transaction)
				confirmId = confirmFlow.confirm_id
			}
			headerCreated = await srvCreateQueueSalesHeader({ ...header, confirm_id: confirmId, wo: spkCreated.woid }, info, transaction)
			await srvCreateQueueSalesDetail(detail, info, transaction)

			// insert queue activity
			let dataActivity = []
			if(typeof orderRequest === 'object' && !!orderRequest) dataActivity.push({ ...orderRequest, queue_no: headerCreated.queuenumber })
			
			dataActivity.push({
				store_id: storeid,
				queue_no: headerCreated.queuenumber,
				text_msg: 'Created Queue.',
				times: info.time
			})

			await srvInsertQueueActivity(dataActivity, transaction)

			await transaction.commit()
			return {
				success: true,
				message: `Queue has been created using no ${headerCreated.queuenumber}`,
				wono: spkCreated.wono,
				queue: headerCreated.queuenumber,
				queueId: info.headerid,
				confirmId
			}
		} else {
			if(checkExistsService.length > 0 && !checkWO) {
				throw {
					localErr: 'Mohon untuk melakukan proses "Save Queue" terlebih dahulu, dikarenakan sistem mendeteksi adanya item "Service" yang akan diinputkan.'
				}
			}
			throw spkCreated
		}
	} catch (er) {
		await transaction.rollback()
		return { success: false, message:  (er.localErr || 'Something went wrong.'), data: {} }
	}
}


export async function srvUpdateQueueSales (_DATA, isChange) {
	const transaction = await sequelize.transaction()
	const { detail, user, storeid, ...header } = _DATA
	const info = {
		headerid: header.headerid,
		user,
		time: moment(),
		storeid
	}
	try {
		await srvUpdateQueueSalesHeader(header, info, transaction)
		await srvUpdateQueueSalesDetail(detail, info, transaction)
		// await srvUpdateQueueSalesMisc(misc, info, transaction)

		if(isChange) {
      const queryDuplicate = `select * from sch_pos.fn_insert_duplicate_spk(${_DATA.wo}, ${storeid}, '${header.headerid}') val`
      await getNativeQuery(queryDuplicate, true, 'RAW', null, transaction)
    }
		await transaction.commit()
		return { success: true, message: 'Queue has been updated' }
	} catch (er) {
		await transaction.rollback()
		return { success: false, message: er.message, data: {} }
	}
}

export async function srvDestroyByCondition (data, status, transaction) {
	const { storeid, headerid, users, memo, woid } = data
	const newTransaction = status === 'DONE' ? transaction : await sequelize.transaction()
	try {
		if(status === 'CANCEL') {
			const sSql = `select * from sch_pos.fn_insert_cancel_queue ('${headerid}', '${memo}', '${users}')`
			await getNativeQuery(sSql,false, 'RAW', null, newTransaction)

			const queryDuplicate = `select * from sch_pos.fn_insert_duplicate_spk(${woid}, ${storeid}, '${headerid}', ${false}) val`
      await getNativeQuery(queryDuplicate, true, 'RAW', null, newTransaction)
		}
		
		await tblQueueSalesDetail.destroy({ where: { storeid, headerid } }, { transaction: newTransaction })
		await tblQueueSales.destroy({ where: { storeid, headerid } }, { transaction: newTransaction })
		
		status === 'DONE' ? null : await newTransaction.commit()
		return { success: true, message: 'Queue has been deleted' }
	} catch (er) {
		status === 'DONE' ? null : await newTransaction.rollback()
		return { success: false, message: er.message, data: {} }
	}
}

export function srvUpdateApprovalQueueProduct (_FILTER, _DATA, user) {
	const { appstatus, appmemo } = _DATA
	const newFilter = _FILTER.map(x => ({ product: x.product, headerid: x.headerid }))
	return tblQueueSalesDetail.update(
		{ appby: user, appdt: moment(), appmemo, appstatus, appdata: false },
		{ where: { [Op.or]: newFilter  } }
	)
} 


export async function srvValidationSales (member, store, listproduct, policeno) {
	const q_date = moment().format('YYYY-MM-DD')
	const sSql = `select * from sch_pos.fn_validation_sales_customer('${q_date}', '${member}', ${store}, '${JSON.stringify(listproduct)}', '${(policeno || '').toString()}') val;`
	const result = await getNativeQuery(sSql,true, 'RAW', null)
	return result
}


export async function srvSetConfirmMechanics (queueID, mechanicCode, confirmID, transaction) {
	// confirm_mechanics
	try {
		if(typeof mechanicCode !== 'string' || mechanicCode === '') throw { message: 'Mechanic Code cannot be null or empty.' }
		else if(typeof confirmID !== 'string' || confirmID === '') throw { message: 'Confirm ID cannot be null or empty.' }
		
		const checkData = await tblQueueSales.findOne({
			attributes: ['queuenumber', 'confirm_mechanics'],
			where: { headerid: queueID },
			raw: true
		})

		if(!checkData) throw { localErrors: true, message: `Couldn\'t find queue using id ${queueID}.` }

		const results = await tblQueueSales.update({
			confirm_mechanics: {
				...checkData.confirm_mechanics,
				[mechanicCode]: confirmID
			}
		}, { where: { headerid: queueID }, transaction })

		return { success: true }
	} catch (er) {
		throw er
	}
}

// [HPP VALIDATION]: FERDINAN - 20250522
export async function srvValidationHPP (productcode, storecode) {
    const sSql = `select * from sch_pos.get_current_hpp('${productcode}', '${storecode}') val;`
    const result = await getNativeQuery(sSql, true, 'RAW', null)
    return result
}
