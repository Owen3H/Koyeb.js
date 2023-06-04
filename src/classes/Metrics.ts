import { APIResponse } from '../interfaces/common/helpers'
import * as fn from '../utils/fn'

export default class Metrics {
    #instanceID: string
    #authToken: string

    constructor(token: string, id: string) {
        this.#authToken = token
        this.#instanceID = id
    }

    get = (metric: MetricType | MetricTypes) => Metrics.get(this.#authToken, {
        instance_id: this.#instanceID,
        name: metric 
    })

    static async get(token: string, query: MetricsQuery) {
        if (!query.instance_id) throw new Error('Must specify `instance_id` to query Metrics.')
        if (!query.name) throw new Error('Must specify `name` to query the correct metric.')

        let url = fn.buildURL(fn.domain + '/streams/metrics', query)
        let res = await fn.sendRequest(url, fn.options(token)).then(res => (res as APIResponse).body.json())

        return res.metrics as MetricsResponse
    }
}