import {
    PublicUser,
    ResponseListItem,
    Plan
} from "../types.js"

export type PublicOrganization = {
    id: string
    name: string
    plan: Plan
    status: Organization.Status
}

export namespace Organization {
    export type Status = "WARNING" | "LOCKED" | "ACTIVE" | "DEACTIVATING" | 
                  "DEACTIVATED" | "DELETING" | "DELETED"

    export type Member = {
        id: string
        organization_id: string
        user_id: string
        joined_at: string
        role: 'INVALID' | 'OWNER'
        status: 'INVALID' | 'ACTIVE' | 'DELETED'
        user: PublicUser
        organization: PublicOrganization
    }

    export type Members = ResponseListItem & {
        members: Member[]
    }
}