const fn = require('../utils/fn')

module.exports = class Deployment {
    #deploymentID = null
    #authToken = null
    
    constructor(id, token) {
        if (!id) throw new Error(`Invalid id parameter '${id}'`)
        if (!token) throw new Error(`Invalid token parameter '${token}'`)

        this.#authToken = token
    }

    get = () => Deployment.get(this.#deploymentID, this.#authToken)
    static async get (id, token) {
        const endpoint = `/deployments/${id}`,
              res = await fn.jsonRequest(endpoint, token)

        return res?.deployment ?? console.error(`Request to ${endpoint} failed! Response:\n${res}`)
    }
}