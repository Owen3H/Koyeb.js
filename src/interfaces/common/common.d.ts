type StringifyObjectValues<T> = { 
    [key in keyof T]: T[key] extends string ? T[key] : string 
}

type KeyValue = {
    key: string
    value: string
}

type BaseError = {
    status: number
    code: string
    message: string
}

type ErrorField = {
    field: string
    description: string
}

type ValidationError = BaseError & {
    fields: ErrorField[]
}

type BaseEventDateTimes = {
    created_at: string
    updated_at: string
}

type EventDateTimes = BaseEventDateTimes & {
    started_at: string
    succeeded_at: string
    paused_at: string
    resumed_at: string
    terminated_at: string
}

type QueryParams = {
    limit?: number
    offset?: number
}

type HttpMethod = 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'CONNECT' | 'OPTIONS' | 'TRACE' | 'PATCH';
type IncomingHttpHeaders = Record<string, string | string[] | undefined>;

type ReqOptions = {
    path: string
    method: HttpMethod
    body?: string | Buffer | Uint8Array | Readable | null | FormData,
    headers?: string[] | IncomingHttpHeaders
}

type ResponseListItem = QueryParams & {
    count: number
}

type IAny = {
    "@type": string
    [key: string]: any
}

type ProtobufAny = {
    type_url: string | null
    value: Uint8Array | null
}

type LogsReponse = {
    result: LogEntry
    error: Omit<BaseError, "status"> & {
        details: IAny[]
    }
}

type LogEntry = {
    msg: string
    created_at: string
    labels: {}
}

type PublicUser = {
    id: string
    email: string
    name: string
    avatar_url: string
    github_id: string
    github_user: string
}

type PlanType = "hobby" | "starter" | "startup" | "business" | "enterprise" | "internal"
declare const enum Plan {
    HOBBY = "hobby",
    STARTER = "starter",
    STARTUP = "startup",
    BUSINESS = "business",
    ENTERPRISE = "enterprise",
    INTERNAL = "internal"
}

type PublicOrganization = {
    id: string
    name: string
    plan: Plan | PlanType = "hobby"
    status: Organization.Status = "WARNING"
}