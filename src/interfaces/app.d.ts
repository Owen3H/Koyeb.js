interface IApp extends AppBaseMetadata {
    domains: Domain[]
}

interface Domain extends AppBaseMetadata {
    type: "AUTOASSIGNED" | "CUSTOM"
    deployment_group: string
    verified_at: string
    intented_cname: string
}

interface AppBaseMetadata {
    name: string
    id: string
    app_id: string
    organization_id: string
    status: "STARTING" | "HEALTHY" | "UNHEALTHY" | "DEGRADED" | 
            "DELETING" | "DELETED" | "PAUSING" | "PAUSED" | "RESUMING"
    messages: string[]
    version: string
}