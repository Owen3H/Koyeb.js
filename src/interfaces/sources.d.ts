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

interface DockerBaseMetadata {
    command: string
    args: string[]
    entrypoint: string[]
}

interface BuildpackBuilder {
    build_command: string
    run_command: string
}

interface GitBaseMetadata {
    repository: string
    branch: string
    sha: string
}

interface GitTrigger {
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