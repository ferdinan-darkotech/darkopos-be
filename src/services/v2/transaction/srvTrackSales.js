import db from '../../../models/tableR'
import moment, { now } from 'moment'
import sequelize from 'sequelize'
import sequelizeDB from '../../../native/sequelize'
import { getNativeQuery } from '../../../native/nativeUtils'
import { setDefaultQuery } from '../../../utils/setQuery'
import { srvSetConfirmMechanics } from './srvQueueSales'

// confirm in customer side
const tbConfirmCustomers = db.tbl_sales_confirm_customers
const tbConfirmMechanics = db.tbl_sales_confirm_mechanics

// history track activities
const tbHistoryQueueActivity = db.tbl_history_queue_activity
const tbQueueActivity = db.tbl_queue_activity

const attrQueueActivity = ['queue_no', 'text_msg', [sequelize.literal(`to_char(created_at, 'DD Mon YYYY hh24:mi:ss')`), 'created_at']]
const attrConfirmCustomers = [
	'confirm_id', 'app_name', 'app_id', 'store_id', 'customer', 'hand_by_customer', 'no_plat',
	'longtitude', 'latitude', 'order_at', 'payment_at', 'status_process'
]

const attrConfirmMechanics = [
	'confirm_id', 'app_name', 'app_id', 'store_id', 'employee', 'in_longtitude', 'in_latitude',
	'out_longtitude', 'out_latitude', 'tap_in', 'tap_out', 'status_process'
]

export function srvGetAllHistoryQueueActivity (store, queue) {
	return tbHistoryQueueActivity.findAll({
		attributes: attrQueueActivity,
		where: {
			store_id: store,
			queue_no: queue
		},
		order: [['created_at', 'asc']],
		raw: true
	})
}

export function srvGetUnreadQueueActivity (listQueue = []) {
	return tbQueueActivity.findAll({
		attributes: ['store_id', 'queue_no'],
		where: {
			queue_no: { $in: listQueue },
			has_read: { $eq: false }
		},
		group: ['store_id', 'queue_no'],
		raw: true
	})
}

export function srvGetAllQueueActivity (store, queue) {
	return tbQueueActivity.findAll({
		attributes: attrQueueActivity,
		where: {
			store_id: store,
			queue_no: queue
		},
		order: [['created_at', 'asc']],
		raw: true
	})
}

export function srvGetConfirmCustomerById (confirmId = null) {
	return tbConfirmCustomers.findOne({
		attributes: attrConfirmCustomers,
		where: {
			confirm_id: confirmId
		},
		raw: true
	})
}

export function srvGetAllConfirmMechanicById (confirmId = []) {
	return tbConfirmMechanics.findAll({
		attributes: attrConfirmMechanics,
		where: {
			confirm_id: { $in: confirmId }
		},
		raw: true
	})
}


export function srvSetReadQueueActivity (store, queue) {
	return tbQueueActivity.update({
		has_read: true
	}, { where: { store_id: store, queue_no: queue } })
}

export function srvInsertQueueActivity (data = [], transaction) {
	const newData = data.map(x => ({
		store_id: x.store_id,
		queue_no: x.queue_no,
		text_msg: x.text_msg,
		created_at: x.times
	}))
	return tbQueueActivity.bulkCreate(newData, { transaction })
}


export function srvInsertTrackCustomerTrans (data, transaction) {
	return tbConfirmCustomers.create({
    app_name: data.app_name,
    app_id: data.app_id,
    store_id: data.store_id,
    customer: data.customer,
    hand_by_customer: data.hand_by_customer,
    no_plat: data.no_plat,
		longtitude: data.longtitude,
		latitude: data.latitude,
    order_at: data.order_at,

	}, { returning: ['*'], raw: true, transaction })
}

export async function srvSetLocationCustomers (confirmId, data, times, transaction) {
	const newTransaction = !transaction ? await sequelizeDB.transaction() : transaction
	try {
		const updatedLocations = await tbConfirmCustomers.update({
			longtitude: data.longtitude,
			latitude: data.latitude
		}, { where: { confirm_id: confirmId }, returning: ['*'], raw: true, transaction: newTransaction })

		if(updatedLocations[0] === 1) {
			const updatedData = ((updatedLocations[1] || [])[0] || {})

			await srvInsertQueueActivity([{
				store_id: updatedData.store_id,
				queue_no: data.queue_no,
				text_msg: 'Set customer locations.',
				times: times
			}], newTransaction)
		}
		!transaction ? await newTransaction.commit() : null
		return updatedLocations
	} catch (er) {
		!transaction ? await newTransaction.rollback() : null
		throw er
	}
}

export async function srvSetTapInMechanics (data, transaction) {
	const newTransaction = !transaction ? await sequelizeDB.transaction() : transaction
	try {
		const createdConfirm = await tbConfirmMechanics.create({
			tap_in: data.times,
			store_id: data.store_id,
			app_name: data.app_name,
			app_id: data.mechanic_contact,
			employee: data.mechanic_code,
			in_longtitude: data.longtitude,
			in_latitude: data.latitude
		}, { returning: ['*'], raw: true, transaction: newTransaction })

		await srvSetConfirmMechanics(data.queue_id, data.mechanic_code, createdConfirm.confirm_id, newTransaction)

		await srvInsertQueueActivity([{
			store_id: createdConfirm.store_id,
			queue_no: data.queue_no,
			text_msg: `Mechanic ${data.mechanic_name || ''} has been set tap-in.`,
			times: data.times
		}], newTransaction)
		
		!transaction ? await newTransaction.commit() : null
		return createdConfirm
	} catch (er) {
		!transaction ? await newTransaction.rollback() : null
		throw er
	}
}

export async function srvSetTapOutMechanics (confirmId, data, transaction) {
	const newTransaction = !transaction ? await sequelizeDB.transaction() : transaction
	try {
		let toReturn = {}
		const updatedLocations = await tbConfirmMechanics.update({
			tap_out: data.times,
			out_longtitude: data.longtitude,
			out_latitude: data.latitude,
			status_process: '02'
		}, { where: { confirm_id: confirmId }, returning: ['*'], raw: true, transaction: newTransaction })

		if(updatedLocations[0] === 1) {
			const updatedData = ((updatedLocations[1] || [])[0] || {})

			await srvInsertQueueActivity([{
				store_id: updatedData.store_id,
				queue_no: data.queue_no,
				text_msg: `Mechanic ${data.mechanic_name || ''} has been set tap-out.`,
				times: moment()
			}], newTransaction)

			toReturn = updatedLocations[1][0]
		} else {
			throw new Error('No data updated.')
		}
		!transaction ? await newTransaction.commit() : null
		return toReturn
	} catch (er) {
		!transaction ? await newTransaction.rollback() : null
		throw er
	}
}

export async function srvSignConfirmPayments (confirmId, queue, timeAt, transaction) {
	const newTransaction = !transaction ? await sequelizeDB.transaction() : transaction
	try {
		const updatedConfirmPayment = await tbConfirmCustomers.update({
			payment_at: timeAt,
			status_process: '02'
		}, { where: { confirm_id: confirmId }, returning: ['*'], raw: true, transaction: newTransaction })

		if(updatedConfirmPayment[0] === 1) {
			const updatedData = ((updatedConfirmPayment[1] || [])[0] || {})

			await srvInsertQueueActivity([{
				store_id: updatedData.store_id,
				queue_no: queue,
				text_msg: 'Customer has been confirm payment.',
				times: timeAt
			}], newTransaction)
		}
		!transaction ? await newTransaction.commit() : null
		return updatedConfirmPayment
	} catch (er) {
		!transaction ? await newTransaction.rollback() : null
		throw er
	}
}