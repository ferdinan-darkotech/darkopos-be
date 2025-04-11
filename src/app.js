

import express from 'express'
// import session from 'express-session'
import session from 'cookie-session'
import errorHandler from 'errorhandler'
import path from 'path'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import favicon from 'serve-favicon'
import pretty from 'pretty-error'
import multer from 'multer'
import cloudinary from 'cloudinary'


import responseLogger from './middleware/responseLogger'
import customErrorHandler from './middleware/errorHandler'

import { schedulePeriodicCheckJob } from './utils/cron'

// import { getConfig, getEnvironment } from './config'
import project from '../config/project.config'
// import routes from './controllers'
import routes from './routers'
import models from './models'

import { imageFilter } from './utils/check'
import handleReceiveMessageFromWA from './services/v2/other/WA-Bot/handler'
import handleReceiveDynamicForm from './services/v2/other/Dynamic-Form/handler'
import { FlowRouters } from './middleware/routerFlow'

import { mapUrl } from './utils/url'
// import * as actions from './controllers/actions/index'  --loadInfo.js

// import swagger from './utils/swagger'
require('./utils/passport') // Setup passport strategies for authentication
const app = express()

schedulePeriodicCheckJob()

cloudinary.config({
  cloud_name: project.cloudinary_cloud_name,
  api_key: project.cloudinary_api_key,
  api_secret: project.cloudinary_api_secret
})

// static content delivery for documentation
app.use(express.static(path.join(__dirname, 'static')))
// app.use(express.static(project.paths.public()))

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(favicon(path.join(__dirname, 'static', 'favicon.ico')))
// app.use(favicon(path.join(project.paths.public(), 'favicon.ico')))
app.use(FlowRouters)

// Enable All CORS Requests
const whitelist = [
  'http://app.darkopos.com', 'http://localhost.com', 'http://app.darkopos.com:8000',
  'http://173.82.100.83:8001', 'http://173.82.100.83'
]

const corsOptions = {
  origin: function (origin, callback) {
    const currentEnv = (project.env || '').toUpperCase()
    callback(null, true)
    // if(whitelist.indexOf(origin) !== -1 || currentEnv === 'DEVELOPMENT') {
    //   callback(null, true)
    // } else {
    //   callback(new Error('Platform not allowed ...'))
    // }
    
  }
}

// app.use(function(req, res, next) {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//   next();
// })
app.use(cors({
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  origin: '*'
}))

app.use(responseLogger(project.res_log_level))
  
if (project.env === 'development') {
  app.use(errorHandler({ dumpExceptions: true, showStack: true }))
}

const sessionOption = {
  secret: 'react and redux rule!!!!',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 60000 }
}

if (app.get('env') === 'production') {
  app.set('trust proxy', 1) // trust first proxy
  sessionOption.cookie.secure = false // serve secure cookies
}

app.use(session(sessionOption))

// Setting up basic middleware for all Express requests
app.use(bodyParser.urlencoded({ extended: true })) // Parses urlencoded bodies
app.use(bodyParser.json({ limit: '5mb' })) // Send JSON responses
// app.use(cookieParser(project.auth_cookie_secret))
app.use(cookieParser())
// models.sequelize.sync().then(() => {
//   console.log('Database ' + project.db_name + ' initialized.')
// }).catch(err => console.error('An Error occured while initializing the database.', err))

app.use('/info', function (req, res) {
  res.render('index', { title: 'Darkotech Mandiri Indonesia', subtitle: 'Point of Sales' });
})


// remove swagger
// /**
//  * Add swagger.io.
//  */
// if (project.env === 'development') {
//   console.log('Swag activated')
//   swagger(app)
// }

/**
 * Add multer
 */
const UPLOAD_PATH = path.join(__dirname, 'static/uploads')
app.use('/uploads', express.static(UPLOAD_PATH))
const upload = multer({ dest: `${UPLOAD_PATH}/`, fileFilter: imageFilter });

app.post('/profile', upload.single('avatar'), async (req, res) => {
  try {
    res.send({ id: 1, request: req.file });
  } catch (err) {
    res.sendStatus(400);
  }
})

// handle webhook of WA-BOT
app.post('/darkopos/connected-api/receive-wa', (req, res, next) => {
  handleReceiveMessageFromWA(req)
  res.end()
})

// handle webhook of DYNAMIC-FORM
app.post('/darkopos/connected-api/receive-dynamic-form', (req, res, next) => {
  return handleReceiveDynamicForm(req, res, next)
})



routes(app)

app.use(customErrorHandler);

// // Render the index page for all routes - website is SPA, routing is made on the FE
// app.get('*', (req, res) => {
//   res.xstatus(200).render('index', {title: 'Blacklist'});
// });

var crypto = require('crypto')
var cipher = crypto.createCipher('aes-128-cbc', project.db_name)
var text = "uncle had a little farm"
var crypted = cipher.update(text, 'utf8', 'hex')
crypted += cipher.final('hex')
//now crypted contains the hex representation of the ciphertext
console.log('crypted', crypted)

export default app
