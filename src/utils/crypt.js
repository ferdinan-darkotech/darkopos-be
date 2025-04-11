const crypto = require('crypto')

export const generateIDMD5 = () => {
  return crypto.createHash('md5').update(Math.random().toString()).digest("hex")
}
export const generateIDSHA1 = () => {
  return crypto.createHash('sha1').update(Math.random().toString()).digest("hex")
}
export const generateIDSHA256 = () => {
  return crypto.createHash('sha256').update(Math.random().toString()).digest("hex")
}
