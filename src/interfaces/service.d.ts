interface IService extends ServiceListItem, EventDateTimes {
    active_deployment_id: string
    latest_deployment_id: string
    state: ServiceState
}

interface ServiceListItem extends AppBaseMetadata {
    updated_at: string
    created_at: string
}

interface ServiceState {
    desired_deployment: DesiredDeployment
    auto_release: AutoRelease
}

interface DesiredDeployment {
    groups: DesiredDeploymentGroup[]
}

interface DesiredDeploymentGroup {
    name: string
    deployment_ids: string[]
}

interface AutoRelease {
    groups: AutoReleaseGroup[]
}

interface AutoReleaseGroup {
    name: string
    repository: string
    git_ref: string
    latest_sha: string
}