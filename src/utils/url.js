export function mapUrl(availableActions = {}, url = []) {
  const notFound = {action: null, params: []};

  // test for empty input
  if (url.length === 0 || Object.keys(availableActions).length === 0) {
    return notFound;
  }
  /*eslint-disable */
  const reducer = (prev, current) => {
    if (prev.action && prev.action[current]) {
      return {action: prev.action[current], params: []}; // go deeper
    } else {
      if (typeof prev.action === 'function') {
        return {action: prev.action, params: prev.params.concat(current)}; // params are found
      } else {
        return notFound;
      }
    }
  };
  /*eslint-enable */

  const actionAndParams = url.reduce(reducer, {action: availableActions, params: []});

  return (typeof actionAndParams.action === 'function') ? actionAndParams : notFound;
}


export function getIPaddr(req) {
  let ipaddr = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
  ipaddr = ipaddr.split(',')[0]
  ipaddr = ipaddr.split(':').slice(-1).toString()
  return ipaddr
}