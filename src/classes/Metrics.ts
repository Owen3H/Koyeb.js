import * as fn from '../utils/fn.cjs'
import * as Undici from 'undici'

type MetricQuery = {
    service_id: string
    instance_id?: string
    name: string
    start?: string
    end?: string
    step?: '5m'
}

export default class Metrics {
    #serviceID: string
    #authToken: string

    static MEM_RSS           = 'MEM_RSS'
    static CPU_TOTAL_PERCENT = 'CPU_TOTAL_PERCENT'

    static PUBLIC_DATA_TRANSFER_IN  = 'PUBLIC_DATA_TRANSFER_IN'
    static PUBLIC_DATA_TRANSFER_OUT = 'PUBLIC_DATA_TRANSFER_OUT'
    
    static HTTP_THROUGHPUT        = 'HTTP_THROUGHPUT'
    static HTTP_RESPONSE_TIME_50P = 'HTTP_RESPONSE_TIME_50P'
    static HTTP_RESPONSE_TIME_90P = 'HTTP_RESPONSE_TIME_90P'
    static HTTP_RESPONSE_TIME_99P = 'HTTP_RESPONSE_TIME_99P'
    static HTTP_RESPONSE_TIME_MAX = 'HTTP_RESPONSE_TIME_MAX'

    constructor(token: string, id: string) {
        this.#authToken = token
        this.#serviceID = id
    }

    get = (metric: string = "UNKNOWN") => Metrics.get(this.#authToken, {
        service_id: this.#serviceID,
        name: metric
    })

    static async get(token: string, query: MetricQuery) {
        if (!query.service_id && !query.instance_id) return
        if (!query.name) return

        let url = fn.buildURL(fn.domain + '/streams/metrics', query)
        let res = await fn.sendRequest(url, fn.options(token)).then(res => (res as Undici.Dispatcher.ResponseData).body.json())

        return res.metrics
    }
}