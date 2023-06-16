import { 
    AppBaseMetadata,
    ResponseListItem,
    QueryParams,
    HttpMethod,
    ReqBody 
} from "../types.js"

export type IDomain = AppBaseMetadata & {
    type: DomainType
    deployment_group: string
    verified_at: string
    intented_cname: string
}

export type DomainListResponse = ResponseListItem & {
    domains: IDomain[]
}

export type DomainType = "AUTOASSIGNED" | "CUSTOM"
export type DomainStatus = "PENDING" | "ACTIVE" | "ERROR" | "DELETING" | "DELETED"

export type DomainQueryParams = QueryParams & {
    name?: string
    app_ids?: string
    types: DomainType
    statuses?: DomainStatus
}

export type DomainBody = {
    name: string
    type: DomainType
    app_id?: string
}

export type DomainReqParams = {
    id: string
    method: HttpMethod
    body?: ReqBody | null | undefined
    token?: string | null | undefined
}