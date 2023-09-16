import { Readable } from "stream"
import { FormData } from "undici"

import { IAny, ObjectValues } from "./util.js"

export type KeyValue = {
    key: string
    value: string
}

export type Identity = {
    id: string
    organization_id: string
    name: string
}

export type BaseError = {
    status: number
    code: string
    message: string
}

export type UnexpectedError = Omit<BaseError, "status"> & {
    details: IAny[]
}

export type ErrorField = {
    field: string
    description: string
}

export type ValidationError = BaseError & {
    fields: ErrorField[]
}

export type BaseEventDateTimes = {
    created_at: string
    updated_at: string
}

export type EventDateTimes = BaseEventDateTimes & {
    started_at: string
    succeeded_at: string
    paused_at: string
    resumed_at: string
    terminated_at: string
}

export type QueryParams = {
    limit?: number
    offset?: number
}

export type HttpMethod = 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'CONNECT' | 'OPTIONS' | 'TRACE' | 'PATCH';
export type IncomingHttpHeaders = Record<string, string | string[] | undefined>;

export type ReqBody = string | Buffer | Uint8Array | Readable | null | FormData
export type ReqOptions = {
    path: string
    method: HttpMethod
    body?: ReqBody,
    headers?: string[] | IncomingHttpHeaders
}

export type ResponseListItem = QueryParams & {
    count: number
}

export type LogsReponse = {
    result: LogEntry
    error: UnexpectedError
}

export type LogEntry = {
    msg: string
    created_at: string
    labels: object
}

export type PublicUser = {
    id: string
    email: string
    name: string
    avatar_url: string
    github_id: string
    github_user: string
}

export type Plan = ObjectValues<typeof PLANS>
export const PLANS = {
    HOBBY: "hobby",
    STARTER: "starter",
    STARTUP: "startup",
    BUSINESS: "business",
    ENTERPRISE: "enterprise",
    INTERNAL: "internal"
} as const