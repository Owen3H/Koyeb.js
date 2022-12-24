import fn from "../utils/fn.js"

export default class App {
    #appID = null
    #authToken = null

    constructor(id, token) {
        if (!id) throw new Error("Parameter 'appID' is required!")
        if (!token) throw new Error("Parameter 'token' is required!")

        this.#appID = id
        this.#authToken = token
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