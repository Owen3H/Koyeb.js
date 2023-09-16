import {
    APIResponse,
    IRepository, 
    RepositoryBranch, 
    RepositoryQuery
} from '../types.js'

import { 
    options, buildURL,
    sendRequest,
    domain 
} from '../utils/fn.js'

export class Repository {
    static async #req(endpoint: string, query: RepositoryQuery, token?: string) {
        const opts = options(token)

        let url = domain + `/git/${endpoint}`
        if (query) url = buildURL(url, query).href

        const res = await sendRequest(url, opts).then((res: APIResponse) => res.body.json()) as any
        return res?.[endpoint]
    }

    static async list(query?: RepositoryQuery, token?: string) {
        return await this.#req('repositories', query, token) as IRepository[]
    }

    static async branches(query?: RepositoryQuery, token?: string) {
        return await this.#req('branches', query, token) as RepositoryBranch[]
    }
}