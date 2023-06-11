import * as fn from '../utils/fn'

export default class Organization {
    #authToken: string
    #id: string

    constructor(id: string, token?: string) {
        if (!id) throw new Error('Invalid parameter `id`. Must be a string!')

        this.#id = id
        this.#authToken = fn.checkValidToken(token)
    }

    resync = () => Organization.resync(this.#id, this.#authToken)
    static async resync(id: string, token?: string) {
        const endpoint = `/git/sync/organization/${id}`
        const res = await fn.sendRequest(endpoint, fn.options(token, 'POST'))

        return res?.statusCode === fn.STATUS_CODES.OK
    }
}