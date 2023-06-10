import * as fn from '../utils/fn.js'

export default class Deployment {
    #deploymentID: string
    #authToken: string
    
    constructor(id: string, token?: string) {
        if (!id) throw new Error(`Invalid id parameter '${id}'`)
        this.#authToken = fn.checkValidToken(token)
    }

    get = () => Deployment.get(this.#deploymentID, this.#authToken)
    static async get (id: string, token: string) {
        fn.checkValidToken(token)

        const endpoint = `/deployments/${id}`,
              res = await fn.jsonRequest(endpoint, token)

        return res?.deployment ?? console.error(`Request to ${endpoint} failed! Response:\n${res}`)
    }
}