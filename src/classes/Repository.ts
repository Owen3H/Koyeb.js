import * as fn from '../utils/fn'

export default class Repository {
    static async #req(endpoint: string, query: RepositoryQuery, token?: string) {
        const opts = fn.options(token)

        let url = fn.domain + `/git/${endpoint}`
        if (query) url = fn.buildURL(url, query).href

        const res = await fn.sendRequest(url, opts).then(res => res.body.json())
        return res?.[endpoint] 
    }

    static async list(query?: RepositoryQuery, token?: string) {
        return await this.#req('repositories', query, token) as IRepository[]
    }

    static async branches(query?: RepositoryQuery, token?: string) {
        return await this.#req('branches', query, token) as RepositoryBranch[]
    }
}