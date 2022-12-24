import { request } from "undici"
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

    listServices = async () => {
        let res = await request(fn.domain + '/services', fn.options(this.#authToken))
            .then(res => res.body.json())
            .catch(e => console.log(e))

        return res.services.filter(service => service.id == this.#appID)
    }
}