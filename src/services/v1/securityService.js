import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import base32 from 'thirty-two'
import CryptoJS from 'crypto-js'
import QRCode from 'qrcode'
import { randomKey } from '../../utils/random'
import project from '../../../config/project.config'
import { replace } from 'lodash'

const getRandomString = (length) => {
  return crypto.randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length)
}

export function sha512 (password, salt) {
  let hash = crypto.createHmac('sha512', salt)
  hash.update(password)
  return hash.digest('hex')
}

export function saltHashPassword (password) {
  let salt = getRandomString(65)
  let hash = sha512(password, salt)

  return {
    salt, hash
  }
}


const secureToken = function (token, type) {
  let stor = ''
  let splitToken = token.split('.')
  if(splitToken.length === 3) {
    if(type === 'dec') {
      const decrypted = CryptoJS.AES.decrypt(splitToken[1], process.env.AUTH_TOKEN_KEY)
      splitToken[1] = decrypted.toString(CryptoJS.enc.Utf8)
    } else if (type === 'enc') {
      const encrypted = CryptoJS.AES.encrypt(splitToken[1], process.env.AUTH_TOKEN_KEY)
      splitToken[1] = encrypted.toString()
    }
  }
  stor = splitToken.join('.')

  return stor
}


export function isValidPassword (password, hash, salt) {
  let pwdHash = sha512(password, salt)
  return pwdHash === hash
}

export function generateToken (obj, temp = false, time = 10) {
  const pureToken = jwt.sign(obj, project.auth_secret, {
    expiresIn: temp ? time : project.auth_expire // in seconds
  })

  return secureToken(pureToken, 'enc')
}

export function reGenerateToken (req, replacers = {}) {
  const { exp, pureToken, ...others } = req.$userAuth
  const pureTokens = jwt.sign({ ...others, ...replacers }, project.auth_secret, { expiresIn: project.auth_expire })

  return secureToken(pureTokens, 'enc')
}

export function getToken (headers) {
  if (headers && headers.authorization) {
    const parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
}

export function extractToken (req) {
  if (req.headers.authorization &&
    req.headers.authorization.split(' ')[0] === 'JWT') {
      return req.headers.authorization.split(' ')[1]
  }
  return null
}

export function extractTokenProfile (req, includePureToken = false) {
  const jwtToken = extractToken(req)
  const pureToken = secureToken(jwtToken, 'dec')
  return {
    ...(jwt.verify(pureToken, project.auth_secret) || {}),
    pureToken: includePureToken ? pureToken : null
  }
}

export function generateTOTP (userId, totp, mode) {
  const key = randomKey(10)
  let encodedKey
  if (totp) {
    encodedKey = totp
  } else {
    encodedKey = base32.encode(key)
    encodedKey = encodedKey.toString('ascii', 0, encodedKey.length)
  }
  if (mode === 'generate') {
    encodedKey = base32.encode(key)
    encodedKey = encodedKey.toString('ascii', 0, encodedKey.length)
  }

  const otpUrl = 'otpauth://totp/' + 'dmiPOS-' + userId + '?secret=' + encodedKey

  function genQRCode (key, totp, param) {
    return new Promise(function (resolve, reject) {
      QRCode.toDataURL(param, function (err, url) {
        if (err !== null) return reject(err)
        resolve([key, url, totp])
      })
    })
  }
  return genQRCode(encodedKey, totp, otpUrl)
}
