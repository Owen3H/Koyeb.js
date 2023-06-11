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

    static async #req(params: DomainReqParams) {
        const { id, method, token, body } = params
        const opts = fn.options(token, method)

        let endpoint = fn.domain + `/domains/${id}`
        if (!body && method === 'POST') 
            endpoint += `/refresh`

        let res = await fn.sendRequest(endpoint, opts)
        if (body) {
            let obj = await res?.body.json()
            return obj?.domain
        }

        return res?.statusCode === 200
    }

    static get = (id: string, token?: string) => 
        Domain.#req({ id, token, method: 'GET' })

    refresh = () => Domain.create(this.#domainID, this.#authToken)
    static refresh = (id: string, token?: string) => 
        Domain.#req({ id, token, method: 'POST' })

    delete = (id: string) => Domain.delete(this.#domainID, this.#authToken)
    static delete = (id: string, token?: string) => 
        Domain.#req({ id, token, method: 'DELETE' })
}