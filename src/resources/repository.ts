import { 
    Identity, 
    ResponseListItem, 
    QueryParams 
} from "../types.js"

export type IRepository = Identity & {
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

export type RepositoryProvider = "INVALID_PROVIDER" | "GITHUB"

export type RepositoryList = ResponseListItem & {
    repositories: IRepository[]
}

export type RepositoryBranch = Identity & {
    repository_id: string
    is_default: boolean
    is_protected: boolean
    provider: RepositoryProvider
}

export type RepositoryBranches = ResponseListItem & {
    branches: RepositoryBranch[]
}

export type RepositoryQuery = QueryParams & Omit<Identity, "organization_id">