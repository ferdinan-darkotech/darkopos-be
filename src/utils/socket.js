import socket from 'socket.io'
import moment from 'moment'
import { extractTokenProfile } from '../services/v1/securityService'
import { ApiError } from '../services/v1/errorHandlingService'
import { getMiscByCodeName } from '../services/v1/miscService'
import { srvGetNotifReminderByCode } from '../services/dashboard/headerService'
import {
  srvGetListQueueApproval, srvGetAllDataQueue, srvGetSomeDetailQueueById, srvGetSomeMainQueueById
} from '../services/v2/transaction/srvQueueSales'
import { srvCashierIdExists } from '../services/cashier/userService'
import fs from 'fs'
import { buildPrefixData } from '../utils/mapping'
import cron from 'cron'
import { srvGetBroadcastLogProductsUpdate, srvSetBroadcastProducts } from '../services/stockService'

const listExistsRooms = {
  'DSHBRD-APPV-PRG': 'DSB:APPV-PROGRESS:{STORE::ARR}',
  'NOTIF-CHANGE-GLOBAL-PRICE-PRODUCT': 'NTF:CG-GLB-PRICE-PRD',
  'NOTIF-CHANGE-LOCAL-PRICE-PRODUCT': 'NTF:CG-LCL-PRICE-PRD:{STORE::ARR}',
  'LIVE-MONITORING-NPS': 'NTF:MNT-NPS:{STORE}',
  'NOTIF-PRIVATE-PROCESS-LOGS': 'NTF:PROC-LOGS',
  'NOTIF-MENU-SALES': 'NTF:MN:SLS:{STORE}',
  'LIVE-FORM-NPS': 'NTF:FORM:NPS:{STORE}'
}

const CronJob = cron.CronJob
let SockIO = socket()
let _socket = null
let _globalPath = null

const getUserLogin = (auth) => {
  try {
    const data = extractTokenProfile({ headers: { authorization: auth } })
    console.log('>> Success', data)
    return data
  } catch (er) {
    console.log('>> Error Socket Connected')
    return {}
  }
}
async function defineUsers (sock, path, errorPath) {
  sock.on('register', ({ auth, role, store }) => {
    const { userid, username } = getUserLogin(auth)
    return srvCashierIdExists(userid).then(exists => {
      if(!userid && !username) {
        throw new Error('Couldn\'t find connected user')
      } else {
        fs.readFile(path, async (er, rows) => {
          if(er) {
            const objectError = {
              company: process.env.args || 'local', state: 'register', message: er.message, detail: er.errno,
              name: er.name, code: er.code, time: moment().format('DD-MM-YYYY hh:mm:ss')
            }
            await fs.appendFileSync(errorPath, `${JSON.stringify(objectError)}\n`)
            return er
          } else {
            let data = (JSON.parse(rows.toString()) || [])
            data.push({ id: sock.id, userid, role, username, store, cashier: exists })
            
            await fs.writeFileSync(path, JSON.stringify(data))
            sock.join(role)
            sock.join(userid)
          }
        })
      }
    }).catch(err => new ApiError(422, `SCK-REG-01: Couldn't register id.`, err))
  })
  
  sock.on('disconnect', ({ auth }) => {
		fs.readFile(path, async (er, rows) => {
      if(er) {
        const objectError = {
          company: process.env.args || 'local', state: 'disconnect', message: er.message, detail: er.errno,
          name: er.name, code: er.code, time: moment().format('DD-MM-YYYY hh:mm:ss')
        }
        await fs.appendFileSync(errorPath, `${JSON.stringify(objectError)}\n`)
        return er
      } else {
        let data = (JSON.parse(rows.toString()) || [])
        const newData = data.filter(x => x.id !== sock.id)
			  await fs.writeFileSync(path, JSON.stringify(newData))
      }
		})
  })
}

function queueApprovalNotif (socket_client_id, store, type) {
  // sock.on('refreshQueueApproval', ({ type, store }) => {
  return getMiscByCodeName('RTNOTIF','QUEUEAPV').then(misc => {
    if(!misc) throw new Error('No misc found')
    else {
      return srvGetListQueueApproval({}, -1, true).then(async appv => {
        const reminder = await srvGetNotifReminderByCode('QUEUEAPV')
        const syncMonitSPK = await srvGetAllDataQueue(store.toString(), 'findOne')
        const listMisc = (misc.miscVariable || '').split(',')
        const rows = await fs.readFileSync(_globalPath, 'utf8')
        let data = (JSON.parse(rows.toString()) || [])
        data.map(x => {
          if(listMisc.indexOf(x.role) !== -1 && socket_client_id !== x.id) {
            SockIO.to(x.id).emit('queueApprovalReceived', { data: appv, type, reminder: reminder || {}, syncMonit: syncMonitSPK })
          }
          // sock.join(x)
        })
      }).catch(err => new ApiError(422, `SCK-QSLS-01: Couldn't find queue.`, err))
    }
    // }).catch(err => new ApiError(422, `SCK-QSLS-02: Couldn't find queue.`, err))
  })
}

function queueListRefresh (socket_client_id, data) {
  // sock.on('broadcastQueue', ({ data }) => {
  const listHeader = data.map(x => x.headerid)
  const reqHeader = srvGetSomeMainQueueById(listHeader)
  const reqDetail = srvGetSomeDetailQueueById(listHeader)
  return Promise.all([reqHeader, reqDetail]).then(async broad => {
    const [mi, di] = broad
    const mainInfo = JSON.parse(JSON.stringify(mi))
    const detailInfo = JSON.parse(JSON.stringify(di))
    if(!mainInfo || !detailInfo) throw new Error('No Data Found')
    else {
      const rows = await fs.readFileSync(_globalPath, 'utf8')
      let data = (JSON.parse(rows.toString()) || [])
      for(let index in data) {
        const filterMain = mainInfo.filter(x => x.storeid === data[index].store)
        const filterDetail = detailInfo.filter(x => x.storeId === data[index].store)
        // console.log('Track', (data[index].cashier === true && _socket.id !== data[index].id && filterMain.length > 0), data[index], _socket.id)
        if((data[index].cashier === true && socket_client_id !== data[index].id && filterMain.length > 0)) {
          SockIO.to(data[index].id).emit('refreshQueue', ({ multipleData: { main: filterMain, detail: filterDetail } }))
        }
      }
    }
  }).catch(err => new ApiError(422, `SCK-RFQ-01: Couldn't find queue.`, err))
}

function sendVerifiedCustomerNumber (userID, mobileNumber, type, verified = false) {
  let payload = {}

  if(verified) {
    payload = {
      verified: true,
      number: mobileNumber,
      verifiedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
      type
    }
  } else {
    payload = {
      verified: false,
      number: mobileNumber,
      type
    }
  }
  SockIO.in(userID).emit('verifiedCustomer', payload)
}

async function scheduleBroadcastProductUpdateLog () {
  return new CronJob(
    '*/2 * * * *',
    async () => {
      try {
        const timeNow = moment()
        const listProducts = await srvGetBroadcastLogProductsUpdate()
        
        if(listProducts.length > 0) {
          const { NO_STORE, ...otherStores } = listProducts.reduce((x, { counts, storecode }) => 
            ({ ...x, [(storecode || 'NO_STORE')]: +(x[(storecode || 'NO_STORE')] || 0) + +counts }), {})

          // console.log(NO_STORE, otherStores)

          if ((NO_STORE || 0) > 0) {
            await bulkSendBroadcast('NOTIF-CHANGE-GLOBAL-PRICE-PRODUCT', 'receiveNotifChangeProductPrice', {}, { type: 'GLOBAL', count: NO_STORE })
          }

          for (let m in (otherStores || {})) {
            const perStoreCounts = (otherStores || {})[m]

            await bulkSendBroadcast('NOTIF-CHANGE-LOCAL-PRICE-PRODUCT', 'receiveNotifChangeProductPrice', { STORE: [m] }, { type: 'LOCAL', count: perStoreCounts }) 
          }

          await srvSetBroadcastProducts(timeNow)
        }
      } catch (err) {
        // Handle error
        console.log('err', err)
      }
    },
    () => {
      console.log('on Complete')
    },
    true,
    'Asia/Jakarta'
  )
}

function socketListen (server, path, errorPath) {
  SockIO = socket(server, {
    handlePreflightRequest: (req, res) => {
      const headers = {
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
          "Access-Control-Allow-Origin": req.headers.origin, //or the specific origin you want to give access to,
          "Access-Control-Allow-Credentials": true
      }
      res.writeHead(200, headers);
      res.end();
    }
  })
  SockIO.on('connect', (sock) => {
    _globalPath = path
    _socket = sock
    defineUsers(sock, path, errorPath)
    
    sock.on("registerRoomsPrefix", payloads => {
      bulkRegisterClientRoomsWithPrefix(sock.id, payloads)
    })
    
    sock.on("leaveRoomsPrefix", payloads => {
      bulkLeaveClientRoomsWithPrefix(sock.id, payloads)
    })
    // queueApprovalNotif(sock, path)
    // queueListRefresh(sock, path)
  })

  scheduleBroadcastProductUpdateLog()
}

function getListSocketId () {
  return SockIO.sockets.adapter.rooms
}

function bulkRegisterClientRoomsWithPrefix (socket_id, data = {}) {
  try {
    const currentSocket = SockIO.sockets.connected[socket_id]
    const { rooms, ...others } = data
    const newRooms = listExistsRooms[rooms]
    const newOthers = (others || {})
    const prefixList = buildPrefixData(newRooms, newOthers)

    for (let x in prefixList) {
      const items = prefixList[x]
      currentSocket.join(items)
      console.log('\x1b[36m')
      console.log(`Client ${socket_id} has been pairing to rooms ${items}.`)
      console.log('\x1b[0m')
    }
  } catch (er) {
    console.log(er)
  }
}

function bulkLeaveClientRoomsWithPrefix (socket_id, data = {}) {
  try {
    const currentSocket = SockIO.sockets.connected[socket_id]
    const { rooms, ...others } = data
    const newRooms = listExistsRooms[rooms]
    const newOthers = (others || {})
    const prefixList = buildPrefixData(newRooms, newOthers)

    console.log('\n')
    for (let x in prefixList) {
      const items = prefixList[x]
      currentSocket.leave(items)
      console.log('\x1b[31m')
      console.log(`Client ${socket_id} has been leave from rooms ${items}.`)
      console.log('\x1b[0m')
    }
  } catch (er) {
    console.log(er)
  }
}

function bulkSendBroadcast (rooms, key, data = {}, payload = {}) {
  try {
    const { ...others } = data
    const newRooms = listExistsRooms[rooms]
    const newOthers = (others || {})
    const prefixList = buildPrefixData(newRooms, newOthers)

    // console.log('\n', prefixList, data, socket_id)
    for (let x in prefixList) {
      const items = prefixList[x]
      SockIO.to(items).emit(key, payload)
      console.log('\x1b[35m')
      console.log(`Broadcast message to rooms ${items} ${items}.`)
      console.log('\x1b[0m')
    }
  } catch (er) {
    console.log(er)
  }
}

export default {
  socketListen,
  getListSocketId,
  queueApprovalNotif,
  queueListRefresh,
  sendVerifiedCustomerNumber,
  bulkSendBroadcast
}