import { 
    EventDateTimes, 
    AppBaseMetadata, 
    ObjectValues
} from "../types.js"

export type IService = ServiceListItem & EventDateTimes & {
    active_deployment_id: string
    latest_deployment_id: string
    state: ServiceState
}

export type ServiceListItem = AppBaseMetadata & {
    updated_at: string
    created_at: string
}

export type ServiceState = {
    desired_deployment: DesiredDeployment
    auto_release: AutoRelease
}

export type DesiredDeployment = {
    groups: DesiredDeploymentGroup[]
}

export type DesiredDeploymentGroup = {
    name: string
    deployment_ids: string[]
}

export type AutoRelease = {
    groups: AutoReleaseGroup[]
}

export type AutoReleaseGroup = {
    name: string
    repository: string
    git_ref: string
    latest_sha: string
}

export type Action = ObjectValues<typeof ACTIONS>
export const ACTIONS = {
    PAUSE: 'pause',
    RESUME: 'resume',
    REDEPLOY: 'redeploy'
} as const