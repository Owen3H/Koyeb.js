import { 
    Identity, 
    KeyValue, 
    GitTrigger, 
    GitSource,
    DockerSource
} from "../types.js"

export type IDeployment = DeploymentStatusDates & DeploymentIds & {
    status: "PENDING" | "PROVISIONING" | "SCHEDULED" | "CANCELING" | "CANCELED" | 
            "ALLOCATING" | "STARTING" | "HEALTHY" | "UNHEALTHY" | "DEGRADED" | 
            "STOPPING" | "STOPPED" | "ERRORING" | "ERROR"
    metadata: { trigger: GitTrigger }
    definition: DeploymentDefinition
    messages: string[]
    provisioning_info: DeploymentProvisioningInfo
    version: string
    deployment_group: string
}

export type DeploymentStatusDates = {
    created_at: string
    updated_at: string
    allocated_at: string
    started_at: string
    succeeded_at: string
    terminated_at: string
}

export type DeploymentIds = Omit<Identity, "name"> & {
    app_id: string
    service_id: string
    parent_id: string
    child_id: string
}

export type DeploymentList = {
    deployments: IDeployment[]
    limit: number
    offset: number
    count: number
}

export type DeploymentInstanceType = {
    scopes: string[]
    type: string
}

export type DeploymentHealthCheck = {
    grace_period: number
    interval: number
    restart_limit: number
    timeout: number
    tcp: { port: number }
    http: {
        port: number
        path: string
        method: string
        headers: KeyValue[]
    }
}

export type DeploymentPort = {
    port: number
    protocol: "tcp" | "http" | "http2"
}

export type DeploymentRoute = {
    port: number
    path: string
}

export type DeploymentEnv = {
    scopes: string[]
    key: string
    value: string
    secret?: string
}

export type DeploymentScaling = {
    scopes: string[]
    min: number
    max: number
}

export type DeploymentDefinition = {
    name: string
    type: "INVALID" | "WEB" | "WORKER"
    routes: DeploymentRoute[]
    ports: DeploymentPort[]
    env: DeploymentEnv[]
    regions: string[]
    scalings?: DeploymentScaling[]
    instance_types: DeploymentInstanceType[]
    health_checks: DeploymentHealthCheck[]
    skip_cache: boolean
    docker?: DockerSource
    git?: GitSource
}

export type DeploymentBuildAttempt = {
    id: number
    status: "UNKNOWN" | "RUNNING" | "FAILED" | "COMPLETED"
    messages: string[]
    started_at: string
    finished_at: string
}

export type DeploymentProvisioningInfoStage = Omit<DeploymentBuildAttempt, "id"> & {
    name: string
    build_attempts: DeploymentBuildAttempt[]
}

export type DeploymentProvisioningInfo = {
    sha: string
    image: string
    stages: DeploymentProvisioningInfoStage[]
}