/* eslint key-spacing:0 spaced-comment:0 */
const path = require('path')
const debug = require('debug')('app:config:project')
const dotenv = require('dotenv').config({ path: path.join(__dirname, '../.env' + process.argv[2] || '') })
const ip = require('ip')

// const envPath = path.join(__dirname, '../', '.env')
// require('dotenv').config({path: envPath})
require('dotenv').config()
debug('Creating default configuration [' + process.env.NODE_ENV + ']')
debug('Database host = ' + process.env.DATABASE_HOST + '## ' + process.env.API_PORT)
debug('Logging = ' + process.env.DATABASE_LOGGING)
// ========================================================
// Default Configuration
// ========================================================
const config = {
  env: process.env.NODE_ENV || 'development',
  res_log_level: process.env.RESPONSE_LOG_LEVEL,

  // ----------------------------------
  // Project Structure
  // ----------------------------------
  path_base: path.resolve(__dirname, '..'),
  dir_client: 'src',
  dir_dist: 'dist',
  dir_public: 'src/static',
  dir_server: 'server',
  dir_test: 'tests',

  // ----------------------------------
  // Cloudinary Configuration
  cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'darkotech',
  cloudinary_api_key: process.env.CLOUDINARY_API_KEY || '441751742895214',
  cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET || 'iTO6U5CoNqAC75HMivCzNvVAid4',

  // ----------------------------------
  // Server Configuration
  // ----------------------------------
  server_host: ip.address(), // use string 'localhost' to prevent exposure on local network
  server_port: process.env.LOCAL_PORT || 5555,
  api_host: process.env.API_HOST || 'apilocalhost',
  api_port: process.env.API_PORT || 5556,
  api_version: process.env.API_VERSION || 'v1',
  api_prefix: '/api/' + process.env.API_VERSION || 'v1',
  api_prefix_v2: '/api/v2',
  api_key : process.env.API_KEY,

  db_url: process.env.DATABASE_URL,
  db_host: process.env.DATABASE_HOST,
  db_port: process.env.DATABASE_PORT,
  db_user: process.env.DATABASE_USER,
  db_pwd: process.env.DATABASE_PSWD,
  db_name: process.env.DATABASE_NAME,
  db_dialect: process.env.DATABASE_DIALECT,
  db_logging: process.env.DATABASE_LOGGING,

  auth_by: process.env.AUTH_BY,
  auth_secret: process.env.AUTH_SECRET,
  auth_expire: process.env.AUTH_EXPIRE,
  auth_cookie_secret: process.env.AUTH_COOKIE_SECRET,
  auth_cookie_name: process.env.AUTH_COOKIE_NAME,

  version: process.env.VERSION,
  message_detail: process.env.MESSAGE_DETAIL,

  // [MPWA CONNECT]: FERDINAN - 31/08/2025
  mpwa_api_key: process.env.API_KEY_MPWA,
  mpwa_url: process.env.MPWA_URL
  // mpwa_sender_phone: process.env.MPWA_SENDER_PHONE
}

// ------------------------------------
// Utilities
// ------------------------------------
function base () {
  const args = [config.path_base].concat([].slice.call(arguments))
  return path.resolve.apply(path, args)
}

config.paths = {
  base: base,
  client: base.bind(null, config.dir_client),
  public: base.bind(null, config.dir_public),
  dist: base.bind(null, config.dir_dist)
}

// ========================================================
// Environment Configuration
// ========================================================
debug(`Looking for environment overrides for NODE_ENV "${config.env}".`)
const environments = require('./environments.config')
const overrides = environments[config.env]
if (overrides) {
  debug('Found overrides, applying to default configuration.')
  Object.assign(config, overrides(config))
} else {
  debug('No environment overrides found, defaults will be used.')
}

module.exports = config
