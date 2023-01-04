const fn = require("../utils/fn")

module.exports = class Service {
    #authToken = null

    #serviceID = null
    #serviceURL = ''

    #paused = false

    constructor(id, token) {
        if (!id) throw new Error(`Invalid id parameter '${id}'`)
        if (!token) throw new Error(`Invalid token parameter '${token}'`)

        this.#serviceID = id
        this.#authToken = token

        this.#serviceURL = `${fn.domain}/services/${this.#serviceID}`
    }

    static Actions = {
        PAUSE: 'pause',
        RESUME: 'resume',
        REDEPLOY: 'redeploy'
    }

    async info() {
        const endpoint = `/services/${this.#serviceID}`,
              res = await fn.jsonRequest(endpoint, this.#authToken)

        return res?.service ?? console.error(`Request to ${endpoint} failed! Response:\n${res}`)
    }
    
    status = async () => {
        let { name, status } = await this.info()
        return `Status of app '${name}':\n ${status}`
    }

    update = () => fn.sendRequest(this.#serviceURL, fn.options(this.#authToken, 'PATCH'))

    paused = async () => this.#paused || (await this.status()).includes('PAUSED') 
    pause() {
        if (this.#paused) return false

        this.paused = true
        this.#runAction(Service.Actions.PAUSE)
    }    

    resume = () => this.#paused ? false : this.#runAction(Service.Actions.RESUME)
    redeploy = () => this.#runAction(Service.Actions.REDEPLOY)

    #runAction = async action => {
        let res = await fn.sendRequest(`${this.#serviceURL}/${action}`, fn.options(this.#authToken, 'POST'))

        this.#paused = action == 'pause' ? true : false
        return res?.statusCode == 200
    }
}