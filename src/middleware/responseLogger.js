import interceptor from 'express-interceptor'

const cleanApiKey = (uri) => uri.replace(/apikey=[^&]*/, "apikey=***")

const responseLogger = function (logLevel) {
  return interceptor((req, res) => {
    let handler = (body) => {
      let remoteAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress
      let time = new Date();
      let statusCode = parseInt(res.statusCode)

      if (logLevel == 'INFO'
        || (logLevel == 'WARN' && statusCode >= 400)
        || (logLevel == 'ERROR' && statusCode >= 500)) {
        console.log(`\n\n[${time.toString()}] New request from : ${remoteAddress}`)
        console.log("================================= REQUEST BEGIN ================================")
        console.log(req.method + " " + cleanApiKey(req.originalUrl) + " HTTP/" + req.httpVersion)
        for (var h in req.headers) {
          console.log(h + ": " + req.headers[h])
        }
        let cl = parseInt(req.headers["content-length"])
        if (cl > 0)
          console.log("\n" + JSON.stringify(req.body, null, 2))
        console.log("================================== REQUEST END =================================")

        console.log("================================= RESPONSE BEGIN ===============================")
        console.log(res['_header'])

        if (/application\/json.*/.test(res['_headers']['content-type']))
          console.log(JSON.stringify(JSON.parse(body), null, 2))
        else
          console.log(body)
        console.log("================================== RESPONSE END ================================")
      } else {
        console.log(`\n\n[${time.toString()}] New request from ${remoteAddress} - ${req.method} ${cleanApiKey(req.originalUrl)} HTTP/${req.httpVersion} - ${statusCode} ${res.statusMessage}`)
      }
    }

    return {
      isInterceptable: () => true,
      intercept: (body, send) => {
        send(body);
      },
      afterSend: (oldBody, newBody) => {
        handler(newBody);
      }
    }
  })
}

export default responseLogger
