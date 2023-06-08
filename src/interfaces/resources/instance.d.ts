type InstanceListEventResponse = ResponseListItem & {
    order?: string
    events: InstanceEvent[]
}

type InstanceListResponse = ResponseListItem & {
    order?: string
    instances: Omit<IInstance, "hypervisor" | "started_at" | "terminated_at">[]
}

type InstanceEvent = {
    id: string
    when: string
    organization_id: string
    instance_id: string
    type: string
    message: string
    metadata: {}
}

type InstanceStatus = "ALLOCATING" | "STARTING" | "HEALTHY" | "UNHEALTHY" | 
                      "STOPPING" | "STOPPED" | "ERROR"

type IInstance = BaseEventDateTimes & Omit<AppBaseMetadata, "status" | "version" | "name"> & {
    service_id: string
    regional_deployment_id: string
    allocation_id: string
    region: string
    datacenter: string
    status: InstanceStatus
    hypervisor?: string
    started_at?: string
    terminated_at?: string
}