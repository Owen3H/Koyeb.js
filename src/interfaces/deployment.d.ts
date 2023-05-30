

interface Deployment extends DeploymentStatusDates, DeploymentIds {
    status: "PENDING" | "PROVISIONING" | "SCHEDULED" | "CANCELING" | "CANCELED" | 
            "ALLOCATING" | "STARTING" | "HEALTHY" | "UNHEALTHY" | "DEGRADED" | 
            "STOPPING" | "STOPPED" | "ERRORING" | "ERROR"
    metadata: {
        trigger: GitTrigger
    }
    definition: DeploymentDefinition
    messages: string[]
    provisioning_info: DeploymentProvisioningInfo
    version: string
    deployment_group: string
}

interface DeploymentStatusDates {
    created_at: string
    updated_at: string
    allocated_at: string
    started_at: string
    succeeded_at: string
    terminated_at: string
}

interface DeploymentIds {
    id: string
    organization_id: string
    app_id: string
    service_id: string
    parent_id: string
    child_id: string
}

interface DeploymentList {
    deployments: Deployment[]
    limit: number
    offset: number
    count: number
}

interface DeploymentInstanceType {
    scopes: string[]
    type: string
}

interface DeploymentHealthCheck {
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

interface DeploymentPort {
    port: number
    protocol: "tcp" | "http" | "http2"
}

interface DeploymentRoute {
    port: number
    path: string
}

interface DeploymentEnv {
    scopes: string[]
    key: string
    value: string
    secret?: string
}

interface DeploymentScaling {
    scopes: string[]
    min: number
    max: number
}

interface DeploymentDefinition {
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

interface DeploymentBuildAttempt {
    id: number
    status: "UNKNOWN" | "RUNNING" | "FAILED" | "COMPLETED"
    messages: string[]
    started_at: string
    finished_at: string
}

interface DeploymentProvisioningInfoStage extends Omit<DeploymentBuildAttempt, "id"> {
    name: string
    build_attempts: DeploymentBuildAttempt[]
}

interface DeploymentProvisioningInfo {
    sha: string
    image: string
    stages: DeploymentProvisioningInfoStage[]
}