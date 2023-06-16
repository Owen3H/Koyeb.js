import {
    EventDateTimes, 
    Identity, 
    ResponseListItem,
    IDomain
} from "../types.js"

export type IApp = AppBaseMetadata & EventDateTimes & {
    domains: IDomain[]
}

export type AppBaseMetadata = Identity & {
    app_id: string
    status: "STARTING" | "HEALTHY" | "UNHEALTHY" | "DEGRADED" | 
            "DELETING" | "DELETED" | "PAUSING" | "PAUSED" | "RESUMING"
    messages: string[]
    version: string
}

export type AppListResponse = ResponseListItem & {
    apps: IApp[]
}