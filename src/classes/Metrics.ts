import { APIResponse } from '../interfaces/common/helpers'
import * as fn from '../utils/fn'

export default class Metrics {
    #serviceID: string
    #authToken: string

    constructor(token: string, id: string) {
        this.#authToken = token
        this.#serviceID = id
    }

    get = (metric: MetricType | MetricTypes) => Metrics.get(this.#authToken, {
        service_id: this.#serviceID,
        name: metric 
    })

    static async get(token: string, query: MetricsQuery) {
        if (!query.service_id && !query.instance_id) return
        if (!query.name) return

        let url = fn.buildURL(fn.domain + '/streams/metrics', query)
        let res = await fn.sendRequest(url, fn.options(token)).then(res => (res as APIResponse).body.json())

        return res.metrics
    }
}