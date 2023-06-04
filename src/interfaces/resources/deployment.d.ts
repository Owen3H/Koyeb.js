type IDeployment = DeploymentStatusDates & DeploymentIds & {
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

type DeploymentStatusDates = {
    created_at: string
    updated_at: string
    allocated_at: string
    started_at: string
    succeeded_at: string
    terminated_at: string
}

type DeploymentIds = {
    id: string
    organization_id: string
    app_id: string
    service_id: string
    parent_id: string
    child_id: string
}

type DeploymentList = {
    deployments: IDeployment[]
    limit: number
    offset: number
    count: number
}

type DeploymentInstanceType = {
    scopes: string[]
    type: string
}

type DeploymentHealthCheck = {
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

type DeploymentPort = {
    port: number
    protocol: "tcp" | "http" | "http2"
}

type DeploymentRoute = {
    port: number
    path: string
}

type DeploymentEnv = {
    scopes: string[]
    key: string
    value: string
    secret?: string
}

type DeploymentScaling = {
    scopes: string[]
    min: number
    max: number
}

type DeploymentDefinition = {
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

type DeploymentBuildAttempt = {
    id: number
    status: "UNKNOWN" | "RUNNING" | "FAILED" | "COMPLETED"
    messages: string[]
    started_at: string
    finished_at: string
}

type DeploymentProvisioningInfoStage = Omit<DeploymentBuildAttempt, "id"> & {
    name: string
    build_attempts: DeploymentBuildAttempt[]
}

type DeploymentProvisioningInfo = {
    sha: string
    image: string
    stages: DeploymentProvisioningInfoStage[]
}