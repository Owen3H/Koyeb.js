import fn from "../utils/fn.js"

export default class Service {
    #serviceID = null
    #authToken = null

    paused = false

    constructor(id, token) {
        if (!id) throw new Error("Parameter 'serviceID' is required!")
        if (!token) throw new Error("Parameter 'token' is required!")

        this.#serviceID = id
        this.#authToken = token
    }

    static Actions = {
        PAUSE: 'pause',
        RESUME: 'resume',
        REDEPLOY: 'redeploy'
    }

    info = async () => {
        let res = await fn.jsonRequest('/services/' + this.#serviceID, this.#authToken)
        if (!res) return

        return res.service
    }

    paused = async () => this.paused ??= await this.status() == 'PAUSED'
    #runAction = async action => {
        let res = await fn.sendRequest(`${fn.domain}/services/${this.#serviceID}/${action}`, fn.options(this.#authToken, 'POST'))
        return res.statusCode == 200
    }

    redeploy = () => this.#runAction(Service.Actions.REDEPLOY)
    resume   = () => this.#runAction(Service.Actions.RESUME)
    pause    = () => this.#runAction(Service.Actions.PAUSE)

    status = async () => {
        let { name, status } = await this.info()
        return `Status of app '${name}':\n ${status}`
    }
}