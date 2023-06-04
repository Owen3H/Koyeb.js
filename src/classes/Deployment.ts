import * as fn from '../utils/fn.js'

export default class Deployment {
    #deploymentID: string | number
    #authToken: string
    
    constructor(id: string | number, token: string) {
        if (!id) throw new Error(`Invalid id parameter '${id}'`)
        if (!token) throw new Error(`Invalid token parameter '${token}'`)

        this.#authToken = token
    }

    get = () => Deployment.get(this.#deploymentID, this.#authToken)
    static async get (id: string | number, token: string) {
        const endpoint = `/deployments/${id}`,
              res = await fn.jsonRequest(endpoint, token)

        return res?.deployment ?? console.error(`Request to ${endpoint} failed! Response:\n${res}`)
    }
}