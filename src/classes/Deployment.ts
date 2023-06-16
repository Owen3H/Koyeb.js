import * as fn from '../utils/fn.js'
import { IDeployment } from '../types.js'

export class Deployment {
    #deploymentID: string
    #authToken: string

    static CANCELLABLE = ["PENDING", "PROVISIONING", "SCHEDULED"]
    
    constructor(id: string, token?: string) {
        if (!id) throw new Error(`Invalid id parameter '${id}'`)
        this.#authToken = fn.checkValidToken(token)
    }

    get = () => Deployment.get(this.#deploymentID, this.#authToken)
    static async get(id: string, token?: string): Promise<IDeployment | null> {
        const endpoint = `/deployments/${id}`,
              res = await fn.jsonRequest(endpoint, token)

        if (!res) {
            console.error(`Request to ${endpoint} failed! Response:\n${res}`)
            return null
        }

        return res.deployment
    }

    static async cancel(deployment: IDeployment, token?: string) {
        if (!this.CANCELLABLE.includes(deployment.status)) {
            console.error(`
                Unable to cancel deployment: ${deployment.id}\n
                Status must be "PENDING", "PROVISIONING" or "SCHEDULED".
            `)

            return false
        }

        const endpoint = fn.domain + `/deployments/${deployment.id}/cancel`
        const res = await fn.sendRequest(endpoint, fn.options(token, 'POST'))

        return res?.statusCode === fn.STATUS_CODES.OK
    }
}