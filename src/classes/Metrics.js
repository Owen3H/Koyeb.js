const fn = require('../utils/fn')

module.exports = class Metrics {
    #serviceID = null
    #authToken = null

    static CPU_TOTAL_PERCENT = 'CPU_TOTAL_PERCENT'
    static MEM_RSS = 'MEM_RSS'

    static HTTP_THROUGHPUT = 'HTTP_THROUGHPUT'
    static HTTP_RESPONSE_TIME_50P = 'HTTP_RESPONSE_TIME_50P'
    static HTTP_RESPONSE_TIME_99P = 'HTTP_RESPONSE_TIME_99P'
    static HTTP_RESPONSE_TIME_90P = 'HTTP_RESPONSE_TIME_90P'
    static HTTP_RESPONSE_TIME_MAX = 'HTTP_RESPONSE_TIME_MAX'

    static PUBLIC_DATA_TRANSFER_IN = 'PUBLIC_DATA_TRANSFER_IN'
    static PUBLIC_DATA_TRANSFER_OUT = 'PUBLIC_DATA_TRANSFER_OUT'

    constructor(token, id) {
        this.#authToken = token
        this.#serviceID = id
    }

    get = metric => Metrics.get(this.#authToken, {
        service_id: this.#serviceID,
        name: metric
    })

    static async get(token, query={ service_id, instance_id, name: 'UNKNOWN', start, end, step: '5m' }) {
        if (!query.service_id && !query.instance_id) return
        if (!query.name) return

        let url = fn.buildURL(fn.domain + '/streams/metrics', query)
        let res = await fn.sendRequest(url, fn.options(token)).then(res => res.body.json())

        return res.metrics
    }
}