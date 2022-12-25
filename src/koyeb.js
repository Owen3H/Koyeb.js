import fn from "./utils/fn.js"

import App from './classes/App.js'
import Service from './classes/Service.js'
import Instance from './classes/Instance.js'
import Deployment from './classes/Deployment.js'
import Logs from './classes/Logs.js'
import Metrics from './classes/Metrics.js'

//const auth = () => request(fn.domain + '/oauth', opts)
const getAppList = token => fn.jsonRequest('/apps', token)
    .then(res => res.apps)
    .catch(e => console.log(e))

export {
    getAppList
}

export default { 
    App, Service, 
    Instance, Deployment,
    Logs, Metrics,
}