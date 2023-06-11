type IApp = AppBaseMetadata & EventDateTimes & {
    domains: IDomain[]
}

type AppBaseMetadata = Identity & {
    app_id: string
    status: "STARTING" | "HEALTHY" | "UNHEALTHY" | "DEGRADED" | 
            "DELETING" | "DELETED" | "PAUSING" | "PAUSED" | "RESUMING"
    messages: string[]
    version: string
}

type AppListResponse = ResponseListItem & {
    apps: IApp[]
}