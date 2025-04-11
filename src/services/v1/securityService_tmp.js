const CryptoJS = require('crypto-js')




const secureToken = function (token, type) {
  let stor = ''
  let splitToken = token.split('.')
  if(splitToken.length === 3) {
    if(type === 'dec') {
      const decrypted = CryptoJS.AES.decrypt(splitToken[1], 'afe9cb04da41152fc6b8de5382a64209')
      splitToken[1] = decrypted.toString(CryptoJS.enc.Utf8)
    } else if (type === 'enc') {
      const encrypted = CryptoJS.AES.encrypt(splitToken[1], 'afe9cb04da41152fc6b8de5382a64209')
      splitToken[1] = encrypted.toString()
    }
  }
  stor = splitToken.join('.')

  return stor
}

console.log('>>>', secureToken(`JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.U2FsdGVkX18jqS+4LG/NOTEVBPTOvWUlovDcieGR8WUytz8tB0jLbhN1MKIPg2ArPpYYp9Xu5LWj7suynVYx4Z0+yWpn+d3mfUKFBvJCV+G3IOqsyJF/hSfaitpRsSCNeFA8FctjNGiZI9AU5LREK2TCbXEO1/8S7ZdC0Z3PFfcDLfRaDoOf5l2vZRTkkXDyXPEeVTIXHBf/43vxSQaoreEn3aGyM7/wZ3TbSrG/ErU0oq6euwrspFyIYCnHFPmlKw4iJSgmJ8EdQToxR7pqyDSXty4s5mlVQgy025TaNzdFkVlhthKQ26IO6PDI9Ed0SDfDFN5eyu6foXG+Oj5q/bT0k8XZvZNjXYjQSCB4EYsN916+k7MhBfebe3GBU0MwJIbHpa2plrVEZXdfel/ZB/dMesS0h0aMEXi8jTxihAJdqseF6GoOkuZnNJ8ec7v3j7eDD/e0BRBIPnIG/NTp2psaE09ysOG+Ag+Ex+fMTi86jeVK/ernJF5sm+ptdwzWj8cWG65N4Cxhz7tP2NUpQaEYdh9qfSeBw0Gm3IIg/r7ssRzGQPns8M/FcwB2zHVqOM61Xy95MLEbkaXu/4C2gPjroAxMn66riY/lQSCfnKTNX9kLHfFGfP6kLXpApJvN.76bYfhYOoI4-4aQthTGeE0R2ooaIoFG9OCv7RUM7FvY`, 'dec'))

