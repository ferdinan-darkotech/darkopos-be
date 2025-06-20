import {
  srvInsertQueueSales, srvUpdateQueueSales, srvGetListQueueByStore, srvGetDataQueue, srvDestroyByCondition,
	srvGetListQueueApproval, srvUpdateApprovalQueueProduct, srvGetApprovalExists, srvGetAllDataQueue,
	srvValidationSales, srvGetHistoryWO, srvGetVoidWO, srvGetOneQueueById,
	srvValidationHPP
} from '../../../services/v2/transaction/srvQueueSales'
import { ApiError } from '../../../services/v1/errorHandlingService'
import { srvGetFormSPK } from '../../../services/v2/transaction/srvSpkForm'
import { getStoreQuery } from '../../../services/setting/storeService'
import { getMemberUnitByPoliceCode } from '../../../services/member/memberUnitService'
import { getMemberByCode } from '../../../services/member/memberService'
import { srvInsertPendingWO, srvGetListPendingWO, srvGetPendingWO, srvDeletePendingWO } from '../../../services/v2/transaction/srvProcessPendingWO'
import { 
	srvGetUnreadQueueActivity, srvGetConfirmCustomerById, srvGetAllConfirmMechanicById,
	srvSetLocationCustomers
} from '../../../services/v2/transaction/srvTrackSales'
import { srvGetTemplateMessageByCode } from '../../../services/v2/other/srvMessageTemplate'
import { sendMessages } from '../../../services/v2/other/WA-Bot/srvWA'
import { compareDiffObjects } from '../../../utils/mapping'
import _socket from '../../../utils/socket'
import moment from 'moment'
import { removeRequestStockOutByQueue } from '../../../services/requestStockOutService'



const remapProduct = x => ({
	bundleId: x.bundleId,
	employee: x.employee,
	product: x.productcode,
	qty: x.qty,
	sellingPrice: x.sellingPrice,
	sellPrice: x.sellprice,
	discountLoyalty: x.discountLoyalty,
	discount: x.discount,
	disc1: x.disc1,
	disc2: x.disc2,
	disc3: x.disc3,
	price: x.price,
	total: x.total,
	typeCode: 'P',
	vouchercode: x.vouchercode,
	voucherno: x.voucherno,
	max_disc_percent: x.max_disc_percent,
	max_disc_nominal: x.max_disc_nominal,
	indentid: x.indentDetailId,
	customerReward: x.customerReward,
	trade_in: x.trade_in,
	...(!x.appdata ?
		{
			appdata: false,
			appmemo: x.appmemo,
			appstatus: x.appstatus,
			appdt: x.appdt,
			appby: x.appby
		} : 
		{
			appdata: true,
			appmemo: null,
			appstatus: null,
			appdt: null,
			appby: null
		}
	),

	// [NEW]: FERDINAN - 2025-03-25
	salestype: x.salestype || 'I',
	additionalpricenominal: x.additionalpricenominal || 0,
	additionalpricepercent: x.additionalpricepercent || 0,
	additionalpriceroundingdigit: x.additionalpriceroundingdigit || 0,

	// [EXTERNAL SERVICE]: FERDINAN - 2025-04-22
	transnopurchase: x.transnopurchase || null,

	// [HPP VALIDATION]: FERDINAN - 2025-05-23
	hppperiod: x.hppperiod || '',
	hppprice: x.hppprice || 0,

	// [NO BAN]: FERDINAN - 2025-06-20
	noreference: x.noreference || null
})

const remapService = x => ({
	bundleId: x.bundleId,
	employee: x.employeeId,
	product: x.code,
	qty: x.qty,
	sellPrice: x.sellPrice,
	sellingPrice: x.price,
	discountLoyalty: x.discountLoyalty,
	discount: x.discount,
	disc1: x.disc1,
	disc2: x.disc2,
	disc3: x.disc3,
	price: x.price,
	total: x.total,
	typeCode: 'S',
	vouchercode: x.vouchercode,
	voucherno: x.voucherno,
	customerReward: x.customerReward,
	...(!x.appdata ?
		{
			appdata: false,
			appmemo: x.appmemo,
			appstatus: x.appstatus,
			appdt: x.appdt,
			appby: x.appby
		} : 
		{
			appdata: true,
			appmemo: null,
			appstatus: null,
			appdt: null,
			appby: null
		}
	),
	keterangan: x.keterangan || null,

	// [NEW]: FERDINAN - 2025-03-26
	// salestype: x.salestype && x.salestype.key ? x.salestype.key : x.salestype || 'I',
	salestype: x.salestype ? x.salestype.key ? x.salestype.key : x.salestype : 'I',
	additionalpricenominal: x.additionalpricenominal || 0,
	additionalpricepercent: x.additionalpricepercent || 0,
	additionalpriceroundingdigit: x.additionalpriceroundingdigit || 0,

	// [EXTERNAL SERVICE]: FERDINAN - 2025-04-22
	transnopurchase: x.transnopurchase || null,

	// [HPP VALIDATION]: FERDINAN - 2025-05-23
	hppperiod: x.hppperiod,
	hppprice: x.hppprice,

	// [NO BAN]: FERDINAN - 2025-06-20
	noreference: x.noreference || null
})


export async function ctlGetVoidWO (req, res, next) {
	console.log('Requesting-ctlGetVoidWO: ' + req.url + ' ...')
	const userLogin = req.$userAuth
	const listStoreId = JSON.parse(JSON.stringify(await getStoreQuery({ user: userLogin.userid }, 'userstorereport')))[0].storeid || ''
	req.query.page = req.query.page ? req.query.page : 1
	req.query.pageSize = req.query.pageSize ? req.query.pageSize : 100
	return srvGetVoidWO({ ...req.query }, listStoreId).then(rs => {
		res.xstatus(200).json({
			success: true,
			data: rs.rows,
			total: rs.count,
			page: req.query.page,
      pageSize: req.query.pageSize
		})
	}).catch(err => next(new ApiError(422, `ZQSL-00000.0: Couldn't get queue`, err)))
}

export async function ctlGetHistoryWO (req, res, next) {
	console.log('Requesting-ctlGetHistoryWO: ' + req.url + ' ...')
	const userLogin = req.$userAuth
	const listStoreId = JSON.parse(JSON.stringify(await getStoreQuery({ user: userLogin.userid }, 'userstorereport')))[0].storeid || ''
	req.query.page = req.query.page ? req.query.page : 1
	req.query.pageSize = req.query.pageSize ? req.query.pageSize : 100
	return srvGetHistoryWO({ ...req.query }, listStoreId).then(rs => {
		res.xstatus(200).json({
			success: true,
			data: rs.rows,
			total: rs.count,
			page: req.query.page,
      pageSize: req.query.pageSize
		})
	}).catch(err => next(new ApiError(422, `ZQSL-00000.1: Couldn't get queue`, err)))
}

export function ctlGetListQueueApproval (req, res, next) {
	console.log('Requesting-ctlGetListQueueApproval: ' + req.url + ' ...')
	const userLogin = req.$userAuth
	return srvGetListQueueApproval({ ...req.query }, userLogin.userid).then(rs => {
		res.xstatus(200).json({
			success: true,
			data: rs,
			total: rs.length
			// page: req.query.page || 1,
      // pageSize: req.query.pageSize || 10
		})
	}).catch(err => next(new ApiError(422, `ZQSL-00000: Couldn't get queue`, err)))
}


export function ctlGetListQueue (req, res, next) {
	console.log('Requesting-ctlGetListQueue: ' + req.url + ' ...')
	const storeid = req.params.store
	const querying = [srvGetListQueueByStore(storeid), srvGetListPendingWO(storeid)]

	return Promise.all(querying).then(rs => {
		const [resultDataQueue, resultDataPending] = rs
		const listQueueNo = resultDataQueue.map(x => x.queuenumber)
		
		return srvGetUnreadQueueActivity(listQueueNo).then(unreadActivity => {

			// remake data queue to define unread activities
			const listQueueActivity = unreadActivity.map(l => l.queue_no)
			const newResultDataQueue = resultDataQueue.map(a => {
				let items = { ...a, unreadActivity: false }
				if(listQueueActivity.indexOf(items.queuenumber) !== -1) {
					items.unreadActivity = true
				}
				return items
			})

			res.xstatus(200).json({
				success: true,
				data: newResultDataQueue,
				dataPending: resultDataPending,
				total: resultDataQueue.length,
				totalPending: resultDataPending.length
			})
		}).catch(err => next(new ApiError(422, `ZQSL-00001: Couldn't get queue`, err)))
	}).catch(err => next(new ApiError(422, `ZQSL-00001: Couldn't get queue`, err)))
}

export async function ctlGetDataQueue (req, res, next) {
	console.log('Requesting-ctlGetDataQueue: ' + req.url + ' ...')
	const userLogin = req.$userAuth
	const storeid = userLogin.store // req.params.store
	const headerid = req.params.header
	
	if(storeid === 'd74d95213b8cff15331d4f6ec53f91cb' && headerid === 'dad14675e5638ca7559d2d202f90a418') {
		const listStoreId = JSON.parse(JSON.stringify(await getStoreQuery({ user: userLogin.userid }, 'userstorereport')))[0].storeid || ''
		return srvGetAllDataQueue(listStoreId).then(rs => {
			res.xstatus(200).json({
				success: true,
				data: rs.rows
			})
		}).catch(err => next(new ApiError(422, `ZQSL-00002.1: Couldn't get queue`, err)))
	} else {
		return srvGetDataQueue(storeid, headerid).then(async rs => {
			let dataTrace = { customer: {}, mechanics: [] }

			let listConfirmMechanics = Object.getOwnPropertyNames((rs.mechanics_confirm || {})).map(x => rs.mechanics_confirm[x])
			if(typeof rs.customer_confirm === 'string') {
				const confirmCust = await srvGetConfirmCustomerById(rs.customer_confirm)

				dataTrace.customer = confirmCust ? {
					id: confirmCust.confirm_id,
					app_name: confirmCust.app_name,
					app_id: confirmCust.app_id,
					confirm_order_at: moment(confirmCust.order_at).unix(),
					confirm_payment_at: moment(confirmCust.payment_at).unix(),
					location: typeof confirmCust.latitude === 'number' && typeof confirmCust.longtitude === 'number' ? `${confirmCust.latitude},${confirmCust.longtitude}` : null 
				} : {}
			}
			
			if (listConfirmMechanics.length > 0) {
				const confirmMech = await srvGetAllConfirmMechanicById(listConfirmMechanics)
				let newConfirmMechanics = []

				if(confirmMech.length > 0 && Array.isArray(confirmMech)) {
					newConfirmMechanics = confirmMech.map(x => ({
						id: x.confirm_id,
						app_name: confirmMech.app_name,
						mechanic: x.employee,
						app_id: confirmMech.app_id,
						tap_in_at: moment(x.tap_in).unix(),
						tap_out_at: moment(x.tap_out).unix(),
						in_location: typeof x.in_latitude === 'number' && typeof x.in_longtitude === 'number' ? `${x.in_latitude},${x.in_longtitude}` : null,
						out_location: typeof x.out_latitude === 'number' && typeof x.out_longtitude === 'number' ? `${x.out_latitude},${x.out_longtitude}` : null
					}))
				}

				dataTrace.mechanics = newConfirmMechanics
			}

			res.xstatus(200).json({
				success: true,
				data: rs,
				dataTrace
			})
		}).catch(err => next(new ApiError(422, `ZQSL-00002.2: Couldn't get queue`, err)))
	}
}

async function sendConfirmWorkorderByWA (activationId, sendTo, data, payloads = {}) {
	try {
		const templates = await srvGetTemplateMessageByCode('FLOW-SLS-CNFRM-WO', data, true)
    const contentText = ((templates.content_body || {}).content || '')
		let contentDynamic = ((templates.content_body || {}).dynamic || null)

		contentDynamic.dataBody = {
			...contentDynamic.dataBody,
			dataInfo: {
				...payloads
			}
		}

		return sendMessages({
      priority: true,
      activation_key: activationId,
      sendTo: [sendTo],
      textMsg: contentText,
			dynamicMessages: contentDynamic
    })
	} catch (er) {
		throw er
	}
}

async function insertToPendingWO (packData, spkData, users) {
	try {
		const timeNow = moment()
		const { contact, member, storeid, unit, detail, otherInformations, activationId, ...headerInformations } = packData
		const prepareData = {
			member,
			store: storeid,
			unit,
			contact,
			trans_header: headerInformations,
			trans_detail: detail,
			other_informations: otherInformations,
			workorder: spkData,
			created_by: users,
			created_at: timeNow
		}

		

		const dataPendingWO = await srvInsertPendingWO(prepareData)
		const recordId = (dataPendingWO[0] || {}).record_id
		
		if(typeof prepareData.contact === 'string' && typeof activationId === 'string' && typeof recordId === 'string') {
			await sendConfirmWorkorderByWA(activationId, prepareData.contact, {
				CustomerName: headerInformations.memberName,
				UnitPlat: unit,
				OrderDate: timeNow.format('DD MMMM YYYY'),
				OrderTime: timeNow.format('HH:mm:ss')
			}, { record_id: recordId })
		}

		return dataPendingWO
	} catch (er) {
		throw er
	}
}


export function ctlInsertQueueSales (req, res, next) {
	console.log('Requesting-ctlInsertQueueSales: ' + req.url + ' ...')
	const userLogin = req.$userAuth
	const storeid = userLogin.store
	const { cashier_trans, service_detail, bundle, spk = {}, restrictItem, ...other } = req.body
	const products = cashier_trans.map(x => remapProduct(x))
	const services = service_detail.map(x => remapService(x))
	const packData = {
		...other,
		bundle: bundle ? (bundle || []).map(x => x.bundleId).join(',') : null,
		detail: [...products, ...services], 
		storeid,
		user: userLogin.userid
	}

	const bundlingKeys = (bundle || []).reduce((x, { code, uniqKey }) => ({ ...x, [code]: uniqKey }), {})
	const otherInformations = {
		...(Object.getOwnPropertyNames(bundlingKeys).length > 0 ? { BUNDLING_KEYS: bundlingKeys } : {})
	}
	return getStoreQuery({ store: storeid }, 'settingstore').then(async stVal => {
		const selfSetting = ((stVal[0] || {}).setting || {})
		const parentSetting = ((stVal[0] || {}).settingparent || {})
		const activationWaID = ((parentSetting.notifSetting || {}).WA || null)

		const salesFlowConfirmations = (selfSetting.salesFlowConfirmations || {})

		return getMemberByCode(packData.member).then(async members => {
			const memberExists = JSON.parse(JSON.stringify(members))
			if(!memberExists.id) throw new Error('Member is not found.')

			if((spk || {}).header) {
				const currUnit = await getMemberUnitByPoliceCode(packData.member, packData.unit)
				if(!currUnit.id) throw new Error('Unit info is not found.')
				spk.header.storeId = storeid
				spk.header.policeNoId = currUnit.id
				spk.header.policeNo = currUnit.policeno
			}
			packData.otherInformations = otherInformations
			
			if(typeof salesFlowConfirmations.order === 'boolean' && salesFlowConfirmations.order) {
				packData.contact = (((memberExists.verifications || {}).WA || {}).id || null)
				packData.memberName = memberExists.memberName
				packData.activationId = activationWaID
				packData.restrictItem = true

				return insertToPendingWO(packData, spk, userLogin.userid).then(rs => {
					const newRs = JSON.parse(JSON.stringify(rs))
					const { _id, __v, ...otherResults } = (newRs[0] || {})
					res.xstatus(200).json({
						success: true,
						message: rs.message,
						data: otherResults,
						pending: true
					})
				})
			} else {
				return srvInsertQueueSales(packData, spk, next).then(rs => {
					if(rs.success) {
						if(rs.wono) {
							return srvGetFormSPK({wono: rs.wono, store: storeid}).then(spk => {
								let jsonObj = {
									success: true,
									message: rs.message,
									spk: spk.data
								}
								if(restrictItem) {
									_socket.queueApprovalNotif(req.body.socketId, storeid, 'getfeedback')
								}
								res.xstatus(200).json(jsonObj)
							}).catch(err => next(new ApiError(501, `Couldn't find spk.`, err)))
						} else {
							let jsonObj = {
								success: true,
								message: rs.message
							}
							if(restrictItem) {
								_socket.queueApprovalNotif(req.body.socketId, storeid, 'getfeedback')
							}
							res.xstatus(200).json(jsonObj)	
						}
					} else {
						console.log(rs.message)
						throw new Error(rs.message)
					}
				}).catch(err => next(new ApiError(422, `ZQSL-00004: Couldn't create queue`, err)))
			}
		}).catch(err => next(new ApiError(422, `ZQSL-00004: Couldn't create queue`, err)))
	}).catch(err => next(new ApiError(422, `ZQSL-00004: Couldn't create queue`, err)))
}

export function ctlUpdateQueueSales (req, res, next) {
	console.log('Requesting-ctlUpdateQueueSales: ' + req.url + ' ...')
	const headerid = req.params.header
	const userLogin = req.$userAuth
	const storeid = req.params.store
	const { cashier_trans, service_detail, bundle, restrictItem, ...other } = req.body
	let packData = {
		...other,
		headerid,
		storeid,
		bundle: bundle ? (bundle || []).map(x => x.bundleId).join(',') : null,
		user: userLogin.userid
	}

	const bundlingKeys = (bundle || []).reduce((x, { code, uniqKey }) => ({ ...x, [code]: uniqKey }), {})
	const otherInformations = {
		...(Object.getOwnPropertyNames(bundlingKeys).length > 0 ? { BUNDLING_KEYS: bundlingKeys } : {})
	}
	
	return srvGetDataQueue(storeid, headerid).then(exists => {

		if(!exists) { throw new Error('Queue doesn\'t exists') }
		else {
			const { cashier_trans: existsProduct, service_detail: existsService } = exists
			
			const compareDetailProduct = compareDiffObjects(
				existsProduct,
				cashier_trans,
				{ productcode: 'productcode' },
				{ productcode: 'productcode' }
			)
			const compareDetailService = compareDiffObjects(
				existsService,
				service_detail,
				{ code: 'code' },
				{ code: 'code' }
			)
			
			const isChange = (compareDetailProduct || compareDetailService)
			const products = cashier_trans.map(x => ({
				...remapProduct(x),
				action: (existsProduct || []).filter(y => y.productcode === x.productcode)[0] ? 'edit' : 'add'
			}))
			const services = service_detail.map(x => ({
				...remapService(x),
				action: (existsService || []).filter(y => y.code === x.code)[0] ? 'edit' : 'add'
			}))
			packData.detail = [...products, ...services]
			packData.otherInformations = otherInformations
			
			return srvUpdateQueueSales(packData, isChange).then(rs => {
				if(!rs.success) throw new Error (rs.message)
				else {
					if(restrictItem) {
						_socket.queueApprovalNotif(req.body.socketId, storeid, 'getfeedback')
					}
					res.xstatus(200).json({
						success: true,
						message: rs.message
					})
				}
			}).catch(err => res.xstatus(400).json({
				success: false,
				message: `ZQSL-00005: Couldn't update queue`,
				detail: err.detail
			}))
		}
	}).catch(err => res.xstatus(400).json({
		success: false,
		message: `ZQSL-00005: Couldn't update queue`,
		detail: err.detail
	}))
}

export function ctlDeleteQueue (req, res, next) {
	console.log('Requesting-ctlDeleteQueue: ' + req.url + ' ...')
	const { userid } = req.$userAuth
	const storeid = req.params.store
	const headerid = req.params.header
	const memo = req.body.memo
	return srvGetOneQueueById(headerid).then(exists => {
		const newExists = (JSON.parse(JSON.stringify(exists)) || {})
		if(!newExists.headerid) { throw new Error('Queue doesn\'t exists') }
		return srvDestroyByCondition({ storeid, headerid, users: userid, memo, woid: newExists.woid }, 'CANCEL').then(rs => {
			if(!rs.success) throw new Error(rs.message)
			else {
				// [DELETE RSO WHEN QUEUE IS DELETED]: FERDINAN - 2025-06-03
				removeRequestStockOutByQueue(exists.queuenumber).then((response) => {
					if (!response.success) throw new Error(response.message)
					res.xstatus(200).json({
						success: true,
						message: rs.message,
					})
				}).catch(err => res.xstatus(400).json({
					success: false,
					message: `ZQSL-00003.4: Couldn't delete queue, Request Stock Out`,
					detail: err.detail
				}))
			}
		}).catch(err => res.xstatus(400).json({
			success: false,
			message: `ZQSL-00003.3: Couldn't delete queue`,
			detail: err.detail
		}))
	}).catch(err => res.xstatus(400).json({
		success: false,
		message: `ZQSL-00003.2: Couldn't delete queue`,
		detail: err.detail
	}))
}

export function ctlUpdateApprovalQueueProduct (req, res, next) {
	console.log('Requesting-ctlUpdateApprovalQueueProduct: ' + req.url + ' ...')
	const { headerid, product, payload, ...other } = req.body
	const { userid: user } = req.$userAuth
	const newPayload = payload ? payload : [{ headerid, product, storeid: other.storeid }]
	return srvGetApprovalExists(newPayload).then(exists => {
		if(!exists[0][0].val) { throw new Error(`Some Queue doesn't exists`) }
		else {
			if((other.appstatus === null || other.appstatus === undefined || [1,2,3].indexOf(other.appstatus) === -1)) {
				return new Error('Wrong Status')
			} else {
				const appstatus = other.appstatus === 1 ? 'Aproved' : other.appstatus === 2 ? 'Rejected' : 'Revision'
				return srvUpdateApprovalQueueProduct(newPayload, other, user).then(rs => {
					_socket.queueListRefresh(req.body.socketId, newPayload)
					res.xstatus(200).json({
						success: true,
						message: `Queue Has been ${appstatus}`,
					})
				}).catch(err => next(new ApiError(422, `ZQSL-00007: Couldn't update queue`, err)))
			}
		}
	}).catch(err => next(new ApiError(422, `ZQSL-00006: Couldn't update queue`, err)))
}



export function ctlValidationSales (req, res, next) {
	console.log('Requesting-ctlValidationSales: ' + req.url + ' ...')
	const { member, store, listProduct = [], policeno } = req.body

	return srvValidationSales(member, store, listProduct, policeno).then(history => {
		res.xstatus(200).json({
			success: true,
			data: history[0][0].val || {}
		})
	}).catch(err => next(new ApiError(422, `ZQSL-00006: Couldn't check validation of transaction`, err)))
}

export function ctlDeletePendingWO (req, res, next) {
	console.log('Requesting-ctlDeletePendingWO: ' + req.url + ' ...')
	const { member, store, listProduct = [], policeno } = req.body

	return srvGetPendingWO(req.params.recordID).then(exists => {
		if(!exists) throw new Error('Data is not found.')

		return srvDeletePendingWO(req.params.recordID).then(deleted => {
			res.xstatus(200).json({
				success: true,
				message: 'Queue has been deleted.'
			})
		}).catch(err => next(new ApiError(422, `ZQSL-00008: Couldn't delete pending queue`, err)))
	}).catch(err => next(new ApiError(422, `ZQSL-00007: Couldn't delete pending queue`, err)))
}


export function ctlResendConfirmationOrder (req, res, next) {
	console.log('Requesting-ctlResendConfirmationOrder: ' + req.url + ' ...')
	return getStoreQuery({ store: req.body.store }, 'settingstore').then(stVal => {
		const parentSetting = ((stVal[0] || {}).settingparent || {})
		const activationWaID = ((parentSetting.notifSetting || {}).WA || null)

		return srvGetPendingWO(req.params.recordID).then(async exists => {
			if(!exists) throw new Error('Data is not found.')
			
			if(typeof activationWaID === 'string') {
				await sendConfirmWorkorderByWA(activationWaID, exists.verified_wa_number, {
					CustomerName: ((exists.trans_header || {}).memberName || ''),
					UnitPlat: exists.unit,
					OrderDate: moment(exists.created_at).format('DD MMMM YYYY'),
					OrderTime: moment(exists.created_at).format('HH:mm:ss')
				}, { record_id: exists.record_id })
				res.xstatus(200).json({
					success: true,
					message: 'Confirmation messages has been sent.'
				})
			} else {
				throw new Error('Activation ID is not found.')
			}
		}).catch(err => next(new ApiError(422, `ZQSL-00007: Couldn't resend confirmation order`, err)))
	}).catch(err => next(new ApiError(422, `ZQSL-00007: Couldn't resend confirmation order`, err)))
}


export function ctlSetLocationCustomers (req, res, next) {
	console.log('Requesting-ctlSetLocationCustomers: ' + req.url + ' ...')
	let dataBody = req.body
	
	return srvGetDataQueue(dataBody.store, dataBody.queue, 'confirm').then(async queueExists => {
		if(!queueExists) throw new Error('Queue is not found.')
		else if (queueExists.customer_confirm !== dataBody.confirm) throw new Error('Confirm ID is unknown.')
		
		dataBody.queue_no = queueExists.queuenumber

		return srvSetLocationCustomers(queueExists.customer_confirm, { ...dataBody }, moment()).then(async ok => {
			res.xstatus(200).json({
				status: true,
				message: 'Location customer has been save.',
				data: {
					confirm_id: queueExists.customer_confirm,
					latitude: dataBody.latitude,
					longtitude: dataBody.longtitude
				}
			})
		}).catch(err => next(new ApiError(422, `ZQSL-00007: Couldn't resend confirmation order`, err)))
	}).catch(err => next(new ApiError(422, `ZQSL-00007: Couldn't resend confirmation order`, err)))
}

// [HPP VALIDATION]: FERDINAN  - 20250522
export function ctlValidationHPP (req, res, next) {
	console.log('Requesting-ctlValidationHPP: ' + req.url + ' ...')
	const { productcode, storecode } = req.body

	return srvValidationHPP(productcode, storecode).then(result => {
		console.log("result >>> ", result)

		res.xstatus(200).json({
			success: true,
			data: result[0][0] || {}
		})
	}).catch(err => next(new ApiError(422, `ZQSL-00008: Couldn't check validation of transaction`, err)))
}
