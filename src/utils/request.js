import axios from 'axios'

const getQueryByName = (name, url) => {
  let match = RegExp('[?&]' + name + '=([^&]*)').exec(url)

  return match && decodeURIComponent(match[1].replace(/\+/g, ' '))
}

export default async function request (pack) {
  let { 
    url,
    method = 'GET',
    data = {},
    body = {}
  } = pack
  
  if(method === 'GET') {
    if(Object.getOwnPropertyNames(data).length > 0) {
      url += getQueryByName('mode', url) ? '&' : '?'
      for(let i in data) {
        url += `${i}=${data[i]}&`
      }
      if(url[url.length - 1] === '&') {
        url = url.substring(0, url.length - 1)
      }
    }
  }

  return await axios.request({
    url,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'Access-Control-Allow-Origin': '*',
      // 'api_key': API_KEY,
      // 'Authorization': `${API_BERIER} ${storages.getToken('user_token')}`
    },
    method,
    data: JSON.stringify(data)
  }).then(response => response.data)
    .catch(error => {
      const er = ((error || {}).response || {}).data

      return er || { message: 'No Connection' }
    })
}