const fn = require('../utils/fn')

interface Deployment {
    id: string
    created_at: string
    updated_at: string
    allocated_at: string
    started_at: string
    succeeded_at: string
    terminated_at: string
    organization_id: string
    app_id: string
    service_id: string
    parent_id: string
    child_id: string
    status: "PENDING" | "PROVISIONING" | "SCHEDULED" | "CANCELING" | "CANCELED" | 
            "ALLOCATING" | "STARTING" | "HEALTHY" | "UNHEALTHY" | "DEGRADED" | 
            "STOPPING" | "STOPPED" | "ERRORING" | "ERROR"
    metadata: {
        trigger: {
            type: "UNKNOWN_TYPE" | "GIT" | "RESUME"
            actor: "UNKNOWN_ACTOR" | "USER" | "SYSTEM"
            git: GitBaseMetadata & {
                provider: "UNKNOWN" | "GITHUB"
                message: string
                sender_username: string
                sender_avatar_url: string
                sender_profile_url: string
            }
        }
    }
    definition: DeploymentDefinition
    messages: string[]
    provisioning_info: {
        sha: string
        image: string
        stages: {}[]
    }
    version: string
    deployment_group: string
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

interface GitBaseMetadata {
    repository: string
    branch: string
    sha: string
}

type GitSource = GitBaseMetadata & {
    tag: string
    build_command: string
    run_command: string
    no_deploy_on_push: boolean
}

interface DeploymentPort {}
interface DeploymentRoute {}

interface DeploymentEnv {
    scopes: string[]
    key: string
    value: string
    secret?: string

}
interface DeploymentScaling {}

interface DeploymentDefinition {
    name: string
    type: "INVALID" | "WEB" | "WORKER"
    routes: DeploymentRoute[]
    ports: DeploymentPort[]
    env: DeploymentEnv[]
    regions: string[]
    scalings?: DeploymentScaling[]
    instance_types: DeploymentInstanceType[]
    health_checks: []
    skip_cache: boolean
    docker?: {}
    git?: GitSource
}

module.exports = class Deployment {
    #deploymentID: string | number
    #authToken: string
    
    constructor(id: string | number, token: string) {
        if (!id) throw new Error(`Invalid id parameter '${id}'`)
        if (!token) throw new Error(`Invalid token parameter '${token}'`)

        this.#authToken = token
    }

    get = () => Deployment.get(this.#deploymentID, this.#authToken)
    static async get (id: string | number, token: string) {
        const endpoint = `/deployments/${id}`,
              res = await fn.jsonRequest(endpoint, token)

        return res?.deployment ?? console.error(`Request to ${endpoint} failed! Response:\n${res}`)
    }
}