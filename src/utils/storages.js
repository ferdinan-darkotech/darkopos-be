let _STATE = {
  listVerifyCustomerWA: {}
}

module.exports = {
  setVerifyCustomerWA: function (key = null, clientId = null, callback = null) {
    try {
      if(typeof key !== 'string' || key === '') throw new Error('Keys cannot be null or empty')
      if(typeof clientId !== 'string' || clientId === '') throw new Error('Values cannot be null or empty')

      _STATE = {
        ..._STATE,
        listVerifyCustomerWA: {
            ..._STATE.listVerifyCustomerWA,
            [key]: {
              clientId,
              action: setTimeout(function () {
                // console.log('Verfication has been ended.')
                clearTimeout(this)
                delete _STATE.listVerifyCustomerWA[key]
                typeof callback === 'function' ? callback() : null
              }, 1000 * 45),

          }
        }
      }
    } catch (er) {
      console.error('[ERR-ON-SAVE-VERIFY-CUST-WA]:', er.message)
    }
  },
  getVerifyCustomerWA: function (key = null) {
    try {
      if(typeof key !== 'string' || key === '') throw new Error('Keys cannot be null or empty')
      let data = (_STATE.listVerifyCustomerWA[key] || {})
      clearTimeout(data.action)
      delete _STATE.listVerifyCustomerWA[key]

      return data.clientId
    } catch (er) {
      console.error('[ERR-ON-GET-VERIFY-CUST-WA]:', er.message)
    }
  }
}