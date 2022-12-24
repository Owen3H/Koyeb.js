import fn from "../utils/fn.js"

export default class Service {
    #serviceID = null
    #authToken = null

    constructor(id, token) {
        if (!id) throw new Error("Parameter 'serviceID' is required!")
        if (!token) throw new Error("Parameter 'token' is required!")

        this.#serviceID = id
        this.#authToken = token
    }

    info = async () => {
        let res = await fn.jsonRequest('/services/' + this.#serviceID, this.#authToken)
        if (!res) return

        return res.service
    }
}