import { request, Agent, setGlobalDispatcher } from "undici"
import fn from "./utils/fn"

import App from './classes/App'
import Service from './classes/Service'
import Instance from './classes/Instance'
import Deployment from './classes/Deployment'
import Logs from './classes/Logs'
import Metrics from './classes/Metrics'

//const auth = () => request(fn.domain + '/oauth', opts)
const getAppList = token => request(fn.domain + '/apps', fn.options(token)).catch(e => console.log(e))

export default { 
    App, Service, 
    Instance, Deployment,
    Logs, Metrics,
    getAppList
}