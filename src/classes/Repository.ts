import * as fn from '../utils/fn'

export default class Repository {
    static async #req(endpoint: string, query: RepositoryQuery, token: string) {
        token = fn.checkValidToken(token)

        let url = fn.domain + `/git/${endpoint}`
        if (query) url = fn.buildURL(url, query).href

        const res = await fn.sendRequest(url, fn.options(token))
            .then(res => res.body.json())

        return res?.[endpoint] 
    }

    static async list(token: string, query?: RepositoryQuery) {
        return await this.#req('repositories', query, token) as IRepository[]
    }

    static async branches(token: string, query?: RepositoryQuery) {
        return await this.#req('branches', query, token) as RepositoryBranch[]
    }
}