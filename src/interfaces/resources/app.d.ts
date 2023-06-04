type IApp = AppBaseMetadata & {
    domains: IDomain[]
}

type AppBaseMetadata = {
    name: string
    id: string
    app_id: string
    organization_id: string
    status: "STARTING" | "HEALTHY" | "UNHEALTHY" | "DEGRADED" | 
            "DELETING" | "DELETED" | "PAUSING" | "PAUSED" | "RESUMING"
    messages: string[]
    version: string
}

type AppListResponse = ResponseListItem & {
    apps: IApp[]
}