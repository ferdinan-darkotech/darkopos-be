import project from '../../../config/project.config'
import fs from 'fs'
import { extractTokenProfile } from '../../services/v1/securityService'

// Retrieve ip address
exports.getIpAddress = function (req, res, next) {
  console.log('Requesting-getIpAddress: ' + req.url + ' ...')
  let ipaddr = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
  console.log('ipaddr', ipaddr)
  ipaddr = ipaddr.split(',')[0];
  ipaddr = ipaddr.split(':').slice(-1).toString();
  res.xstatus(200).json({
    success: true,
    message: 'Ok',
    ipAddress: ipaddr
  })
}

exports.getBEInfo = function (req, res, next) {
  res.xstatus(200).json({
    success: true,
    message: 'Ok',
    info: {
      version: project.version,
      message: project.db_name.split('dmi_pos_').slice(-1).toString().split("").reverse().join("")
    }
  })
}

exports.getBEInfo = function (req, res, next) {
  const userLogIn = extractTokenProfile(req)
  const rootFile = require('path').dirname(process.cwd())
  const socketPath = `${rootFile}/socket-storage/socket-${process.env.args || 'local'}.json`
  fs.readFile(socketPath, async (er, rows) => {
    if(er) {
      res.xstatus(400).json({
        success: true,
        message: er.message,
      })
      return
    } else {
      let data = (JSON.parse(rows.toString()) || [])
      const exists = data.filter(x => x.id === req.body.socketid && x.userid === userLogIn.userid)[0]
      if(exists) {
        res.xstatus(200).json({
          success: true,
          message: 'Socket Is Connected Now'
        })
      } else {
        res.xstatus(404).json({
          success: false,
          message: 'Socket ID couldn\'t be found'
        })
      }
    }
  })
}