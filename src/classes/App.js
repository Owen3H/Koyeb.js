import { request } from "undici"
import fn from "./utils/fn"

export default class App {
    #appID = null
    #authToken = null

    constructor(id, token) {
        if (!id) throw new Error("Parameter 'appID' is required!")
        if (!token) throw new Error("Parameter 'token' is required!")

        this.#appID = id
        this.#authToken = token
    }

    listServices = () => request(fn.domain + '/services', fn.options(this.#authToken)).catch(e => console.log(e))
}