//@ts-nocheck
import { APIResponse } from '../interfaces/common/helpers'
import { MetricTypes } from '../utils/enums'

import * as fn from '../utils/fn'

export default class Metrics {
    #instanceID: string
    #authToken: string

    constructor(id: string, token?: string) {
        if (!id) throw new Error(`Invalid id parameter '${id}'`)

        this.#instanceID = id
        this.#authToken = fn.checkValidToken(token)
    }

    all = (id: string, includeLabels: boolean = true) => Metrics.all(id, includeLabels, this.#authToken)
    static async all(id: number | string, includeLabels: boolean = true, token: string) {
        const values = Object.values(MetricTypes)
        let collection: MetricCollection = {}

        for (const type of values) {
            let res = await Metrics.get(token, { 
                name: type,
                instance_id: id.toString()
            })

            if (!res) continue
            if (!includeLabels) delete res[0].labels

            collection[type] = res
        }

        return collection
    }

    get = (metric: MetricType | MetricTypes) => Metrics.get({ 
        instance_id: this.#instanceID, 
        name: metric 
    }, this.#authToken)

    static async get(query: MetricsQuery, token: string) {
        if (!query.instance_id) throw new Error('Must specify `instance_id` to query Metrics.')
        if (!query.name) throw new Error('Must specify `name` to query the correct metric.')

        let url = fn.buildURL(fn.domain + '/streams/metrics', query)
        let res = await fn.sendRequest(url, fn.options(token)).then(res => (res as APIResponse).body.json())
        
        return res.metrics as MetricsResponse
    }
}