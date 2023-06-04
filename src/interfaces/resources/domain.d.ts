type IDomain = AppBaseMetadata & {
    type: "AUTOASSIGNED" | "CUSTOM"
    deployment_group: string
    verified_at: string
    intented_cname: string
}

type DomainListResponse = ResponseListItem & {
    domains: IDomain[]
}