type IDomain = AppBaseMetadata & {
    type: DomainType
    deployment_group: string
    verified_at: string
    intented_cname: string
}

type DomainListResponse = ResponseListItem & {
    domains: IDomain[]
}

type DomainType = "AUTOASSIGNED" | "CUSTOM"
type DomainStatus = "PENDING" | "ACTIVE" | "ERROR" | "DELETING" | "DELETED"

type DomainQueryParams = QueryParams & {
    name?: string
    app_ids?: string
    types: DomainType
    statuses?: DomainStatus
}

type DomainBody = {
    name: string
    type: DomainType
    app_id?: string
}

type DomainReqParams = {
    id: string
    method: HttpMethod
    body?: ReqBody | null | undefined
    token?: string | null | undefined
}