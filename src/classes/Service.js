const fn = require("../utils/fn")

module.exports = class Service {
    #serviceID = null
    #authToken = null

    #paused = false

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

    async info() {
        const endpoint = `/services/${this.#serviceID}`,
              res = await fn.jsonRequest(endpoint, this.#authToken)

        return res ? res.service : console.error(`Request to ${endpoint} failed! Response:\n${res}`)
    }

    #runAction = async action => {
        let res = await fn.sendRequest(`${fn.domain}/services/${this.#serviceID}/${action}`, fn.options(this.#authToken, 'POST'))

        this.#paused = action == 'pause' ? true : false
        return res?.statusCode == 200
    }

    redeploy = () => this.#runAction(Service.Actions.REDEPLOY)
    resume = () => this.#paused ? false : this.#runAction(Service.Actions.RESUME)

    async paused() { 
        if (this.#paused) return true
        return (await this.status()).includes('PAUSED') 
    }

    pause() {
        if (this.#paused) return false

        this.paused = true
        this.#runAction(Service.Actions.PAUSE)
    }

    status = async () => {
        let { name, status } = await this.info()
        return `Status of app '${name}':\n ${status}`
    }
}