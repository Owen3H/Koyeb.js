//@ts-nocheck
import { APIResponse } from '../interfaces/common/helpers'

import * as fn from '../utils/fn'

export default class Domain {
    #domainID: string
    #authToken: string

    constructor(id: string, token?: string) {
        this.#authToken = fn.checkValidToken(token)

        if (!id) throw new Error('Domain `id` must be provided in the constructor.')
        this.#domainID = id
    }

    static async #req(id: string, token: string, method: HttpMethod, body?: ReqBody) {
        fn.checkValidToken(token)
        
        let endpoint = `/domains/${id}`
        if (!body && method === 'POST') 
            endpoint += `/refresh`

        let res = await fn.sendRequest(endpoint, fn.options(token, method))
        if (body) {
            let obj = await res?.body.json()
            return obj?.domain
        }

        return res?.statusCode === 200
    }

    static async get = (id: string, token: string) => Domain.#send(id, token, 'GET')

    async create = (id: string, token: string) => Domain.create(this.#domainID, this.#authToken)
    static async create = (id: string, token: string) => Domain.#req(id, token, 'POST')

    async delete = (id: string, token: string) => Domain.delete(this.#domainID, this.#authToken)
    static async delete = (id: string, token: string) => Domain.#req(id, token, 'DELETE')
}