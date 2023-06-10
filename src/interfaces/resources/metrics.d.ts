type MetricsQuery = {
    name: string | MetricType | MetricTypes
    service_id?: string
    instance_id: string
    start?: string
    end?: string
    step?: string
}

type StringNumArr = string[] | number[]
type MetricsResponse = [{
    labels?: { [key: string]: string }
    values: StringNumArr[]
}]

type MetricType = 'MEM_RSS' | 'CPU_TOTAL_PERCENT' | 'PUBLIC_DATA_TRANSFER_IN' | 
                  'PUBLIC_DATA_TRANSFER_OUT' | 'HTTP_THROUGHPUT' | 'HTTP_RESPONSE_TIME_50P' | 
                  'HTTP_RESPONSE_TIME_90P' | 'HTTP_RESPONSE_TIME_99P' | 'HTTP_RESPONSE_TIME_MAX'

type MetricCollection = {
    [key: string]: MetricsResponse
}