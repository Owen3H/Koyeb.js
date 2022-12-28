const fn = require("../utils/fn")

module.exports = class App {
    #appID = null
    #authToken = null

    constructor(token) {
        if (!token) throw new Error("Parameter 'token' is required!")
        this.#authToken = token
    }

    static list = async token => fn.jsonRequest('/apps', token)
        .then(res => res.apps)
        .catch(e => console.log(e))

    fromID = id => {
        if (!id) throw new Error("Parameter 'appID' is required!")
        this.#appID = id

        return this
    }

    fromName = async name => {
        if (!name) throw new Error("Parameter 'name' is required!")
        
        const apps = await App.list(this.#authToken)
        const app = await apps.find(app => app.name === name.trim())[0]

        if (!app) throw new Error(`Could not find app with name '${name}'`)
        this.#appID = app.id

        return this
    }

    fromIndex = async index => {
        if (!index && index != 0) throw new Error("Parameter 'index' is required!")

        const apps = await App.list(this.#authToken)
        const app = apps[index]

        if (!app) throw new RangeError(`App does not exist at index ${index}`)
        this.#appID = app.id

        return this
    }

    info = async () => {
        let res = await fn.jsonRequest('/apps/' + this.#appID, this.#authToken)
        if (!res) return

        return res.app
    }

    listServices = async () => {
        let res = await fn.jsonRequest('/services', this.#authToken)
        if (!res) return

        return res.services.filter(service => service.app_id == this.#appID)
    }
}