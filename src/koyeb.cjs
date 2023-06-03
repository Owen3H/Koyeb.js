const App = require("./classes/App"),
      Service = require("./classes/Service"),
      Instance = require("./classes/Instance"),
      Deployment = require("./classes/Deployment"),
      Logs = require("./classes/Logs"),
      Metrics = require("./classes/Metrics"),
      { setToken, getToken } = require("./utils/fn")

module.exports = {
    App, Service, 
    Instance, Deployment,
    Logs, Metrics,
    setGlobalToken: setToken,
    getGlobalToken: getToken
}