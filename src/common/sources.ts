export type DockerSource = DockerBaseMetadata & {
    image_registry_secret: string
    image: string
}

export type DockerBuilder = DockerBaseMetadata & {
    dockerfile: string
    target: string
}

export type GitSource = GitBaseMetadata & BuildpackBuilder & {
    tag: string
    no_deploy_on_push: boolean
    workdir: string
    buildpack?: BuildpackBuilder
    docker?: DockerBuilder
}

export type DockerBaseMetadata = {
    command: string
    args: string[]
    entrypoint: string[]
}

export type BuildpackBuilder = {
    build_command: string
    run_command: string
}

export type GitBaseMetadata = {
    repository: string
    branch: string
    sha: string
}

export type Provider = "UNKNOWN" | "GITHUB"
export type TriggerType = "UNKNOWN_TYPE" | "GIT" | "RESUME"
export type Actor = "UNKNOWN_ACTOR" | "USER" | "SYSTEM"

export type GitTrigger = {
    type: TriggerType
    actor: Actor
    git: GitBaseMetadata & {
        provider: Provider
        message: string
        sender_username: string
        sender_avatar_url: string
        sender_profile_url: string
    }
}