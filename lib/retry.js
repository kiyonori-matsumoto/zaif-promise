const rp = require('request-promise-native')

const history = {}

module.exports = {
  add: (method, request) => {
    history[method] = request;
    return request;
  },
  retry: (method) => {
    if(!history[method])
      return Promise.reject("no method executed")

    return rp(history[method]).then(JSON.parse).then( (d) => {
      if (d.error === "nonce not incremented") {
        return Promise.resolve("already successed")
      } else if(d.success === 0) {
        return Promise.reject(new Error(d.error));
      } else {
        return Promise.resolve(d.return);
      }
    });
  }
}