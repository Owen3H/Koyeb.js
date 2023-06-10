type DockerSource = DockerBaseMetadata & {
    image_registry_secret: string
    image: string
}

type DockerBuilder = DockerBaseMetadata & {
    dockerfile: string
    target: string
}

type GitSource = GitBaseMetadata & BuildpackBuilder & {
    tag: string
    no_deploy_on_push: boolean
    workdir: string
    buildpack?: BuildpackBuilder
    docker?: DockerBuilder
}

type DockerBaseMetadata = {
    command: string
    args: string[]
    entrypoint: string[]
}

type BuildpackBuilder = {
    build_command: string
    run_command: string
}

type GitBaseMetadata = {
    repository: string
    branch: string
    sha: string
}

type Provider = "UNKNOWN" | "GITHUB"
type TriggerType = "UNKNOWN_TYPE" | "GIT" | "RESUME"
type Actor = "UNKNOWN_ACTOR" | "USER" | "SYSTEM"

type GitTrigger = {
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