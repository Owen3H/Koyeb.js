type IDomain = AppBaseMetadata & {
    type: "AUTOASSIGNED" | "CUSTOM"
    deployment_group: string
    verified_at: string
    intented_cname: string
}

type DomainListResponse = ResponseListItem & {
    domains: IDomain[]
}

type DomainStatus = "PENDING" | "ACTIVE" | "ERROR" | "DELETING" | "DELETED"
type DomainQueryParams = QueryParams & {
    name?: string
    app_ids?: string
    types: "AUTOASSIGNED" | "CUSTOM"
    statuses?: DomainStatus
}