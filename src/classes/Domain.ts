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

        const res = await fn.sendRequest(endpoint, opts)
        if (body) {
            const obj = await res?.body.json()
            return obj?.domain
        }

        return res?.statusCode === fn.STATUS_CODES.OK
    }

    // static list = () => d

    static get = async (id: string, token?: string) => 
        await Domain.#req({ id, token, method: 'GET' }) as IDomain

    refresh = () => Domain.create(this.#domainID, this.#authToken)
    static refresh = async (id: string, token?: string) => 
        await Domain.#req({ id, token, method: 'POST' }) as boolean

    delete = () => Domain.delete(this.#domainID, this.#authToken)
    static delete = async (id: string, token?: string) => 
        await Domain.#req({ id, token, method: 'DELETE' }) as boolean
}