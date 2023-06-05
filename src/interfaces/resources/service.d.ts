type IService = ServiceListItem & EventDateTimes & {
    active_deployment_id: string
    latest_deployment_id: string
    state: ServiceState
}

type ServiceListItem = AppBaseMetadata & {
    updated_at: string
    created_at: string
}

type ServiceState = {
    desired_deployment: DesiredDeployment
    auto_release: AutoRelease
}

type DesiredDeployment = {
    groups: DesiredDeploymentGroup[]
}

type DesiredDeploymentGroup = {
    name: string
    deployment_ids: string[]
}

type AutoRelease = {
    groups: AutoReleaseGroup[]
}

type AutoReleaseGroup = {
    name: string
    repository: string
    git_ref: string
    latest_sha: string
}

type ActionType = 'pause' | 'resume' | 'redeploy'