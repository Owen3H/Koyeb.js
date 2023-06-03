type StringifyObjectValues<T> = { 
    [key in keyof T]: T[key] extends string ? T[key] : string 
}

interface KeyValue {
    key: string
    value: string
}

interface BaseError {
    status: number
    code: string
    message: string
}

interface ErrorField {
    field: string
    description: string
}

interface ValidationError extends BaseError {
    fields: ErrorField[]
}

interface EventDateTimes {
    created_at: string
    updated_at: string
    started_at: string
    succeeded_at: string
    paused_at: string
    resumed_at: string
    terminated_at: string
}