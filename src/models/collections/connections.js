import mongoose from 'mongoose'

const mongoConfig = {
  useNewUrlParser: true,
  useUnifiedTopology: true
}

let mongoAuth = {}
if(process.env.MONGO_USE_AUTH === 'Y') {
  mongoAuth = {
    authSource: process.env.MONGO_AUTH_SRC,
    user: process.env.MONGO_AUTH_USER,
    pass: process.env.MONGO_AUTH_PASS
  }
}

mongoose.connect(`mongodb://${process.env.NOSQL_CONNECTIONS_LOCAL}`, {
  ...mongoAuth
}).then(async res => {
  console.log('\x1b[32m', '\n[INFO-SUCCESS] : MongoDB has been connected.\n')
  console.log('\x1b[0m')
}).catch(er => {
  console.log(er)
  console.log('\x1b[31m', '\n[INFO-FAILS] : Cannot connect mongo server, connection is not define.\n')
  console.log('\x1b[0m') 
})
mongoose.Promise = global.Promise

if(process.env.NODE_ENV === 'development') {
  mongoose.set('debug', function (coll, method, query) {
    if(method !== 'createIndex') {
      console.log('\n')
      console.info(
        '[MONGO-QUERY]' +
        '\nCls   : '+ coll +
        '\nMtd   : ' + method +
        '\nQuery : ' + JSON.stringify((query || {})))
      console.log('\n')
    }
  })
}




export default mongoose