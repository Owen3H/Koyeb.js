type IRepository = Identity & {
    url: string
    description: string
    is_private: boolean
    is_disabled: boolean
    default_branch: string
    provider: RepositoryProvider
    last_push_date: string
    github: {
        github_id: string
    }
}

type RepositoryProvider = "INVALID_PROVIDER" | "GITHUB"

type RepositoryList = ResponseListItem & {
    repositories: IRepository[]
}

type RepositoryBranch = Identity & {
    repository_id: string
    is_default: boolean
    is_protected: boolean
    provider: RepositoryProvider
}

type RepositoryBranches = ResponseListItem & {
    branches: RepositoryBranch[]
}

type RepositoryQuery = QueryParams & Omit<Identity, "organization_id">