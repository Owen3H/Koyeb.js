declare namespace Organization {
    declare type Status = "WARNING" | "LOCKED" | "ACTIVE" | "DEACTIVATING" | 
                         "DEACTIVATED" | "DELETING" | "DELETED"

    declare type Member = {
        id: string
        organization_id: string
        user_id: string
        joined_at: string
        role: 'INVALID' | 'OWNER' = 'INVALID'
        status: 'INVALID' | 'ACTIVE' | 'DELETED' = 'INVALID'
        user: PublicUser
        organization: PublicOrganization
    }

    declare type Members = ResponseListItem & {
        members: Member[]
    }
}