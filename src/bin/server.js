#!/usr/bin/env node

// require("babel-core/register")
// require("babel-polyfill")
// if (!global._babelPolyfill) {
  // require('babel/polyfill')
// }
// import "babel-polyfill";

/**
 * Module dependencies.
 */
import http from 'http'
import project from '../../config/project.config'
import app from '../app'
import fs from 'fs'
import _socket from '../utils/socket'


/**
 * Get port from environment and store in Express.
 */
const rootFile = require('path').dirname(process.cwd())
const socketPath = `${rootFile}/socket-storage/socket-${process.env.args || 'local'}.json`
const logSocketPath = `${rootFile}/socket-storage/socket-log-error.json`
let port = normalizePort(project.api_port)
app.set('port', port)

/**
 * Create HTTP server.
 */

let server = http.createServer(app)

/**
 * Add socket.io.
 */

// remove all socket user
fs.writeFileSync(socketPath, JSON.stringify([]))

_socket.socketListen(server, socketPath, logSocketPath)

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port)
server.on('error', onError)
server.on('listening', onListening)

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10)

  if (isNaN(port)) {
    // named pipe
    return val
  }

  if (port >= 0) {
    // port number
    return port
  }

  return false
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error
  }

  let bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges')
      process.exit(1)
      break
    case 'EADDRINUSE':
      console.error(bind + ' is already in use')
      process.exit(1)
      break
    default:
      throw error
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  let addr = server.address()
  let bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port
  console.log('Server is listening on port ' + port + '-' + bind + '. Running version ' + project.version)
}

export default server
