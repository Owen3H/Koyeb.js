//@ts-nocheck
import { APIResponse } from '../interfaces/common/helpers'

import * as fn from '../utils/fn'

export default class Domain {
    #instanceID: string
    #authToken: string

    constructor(id: string, token?: string) {
        this.#authToken = token

        if (!id) throw new Error('Domain `id` must be provided in the constructor.')
        this.#instanceID = id
    }

    static async delete(auth: KoyebAuth) {
        const res = await fn.jsonRequest('/domains', token, 'DELETE')
        return res?.statusCode === 200
    }
}