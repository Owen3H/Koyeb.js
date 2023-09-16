import * as fn from '../utils/fn.js'

import {
    APIResponse,
    MetricsQuery,
    MetricCollection,
    MetricsResponse,
    Metric,
    METRICS
} from '../types.js'

export class Metrics {
    #instanceID: string
    #authToken: string

    constructor(id: string, token?: string) {
        if (!id) throw new Error(`Invalid id parameter '${id}'`)

        this.#instanceID = id
        this.#authToken = fn.checkValidToken(token)
    }

    all = (id: string, includeLabels = true) => Metrics.all(id, this.#authToken, includeLabels)
    static async all(id: number | string, token: string, includeLabels = true) {
        const values = Object.values(METRICS)
        const collection = {}

        for (const type of values) {
            const res = await Metrics.get({ 
                instance_id: id.toString(),
                name: type
            }, token)

            if (!res) continue
            if (!includeLabels) delete res[0].labels

            //@ts-ignore
            collection[type] = res
        }

        return collection as MetricCollection
    }

    get = (metric: Metric) => Metrics.get({ 
        instance_id: this.#instanceID, 
        name: metric 
    }, this.#authToken)

    static async get(query: MetricsQuery, token: string) {
        if (!query.instance_id) throw new Error('Must specify `instance_id` to query Metrics.')
        if (!query.name) throw new Error('Must specify `name` to query the correct metric.')

        const url = fn.buildURL(fn.domain + '/streams/metrics', query)
        const res = await fn.sendRequest(url, fn.options(token)).then(res => (res as APIResponse).body.json()) as any
        
        return res.metrics as MetricsResponse
    }
}