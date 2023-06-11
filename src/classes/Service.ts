import * as fn from "../utils/fn.js"
import { currentDeployment, Environment } from "./Environment.ts"

import { APIResponse } from "../interfaces/common/helpers"
import { Actions } from "../utils/enums.ts"

export default class Service {
    #authToken: string

    #serviceID: string
    #serviceURL: string

    #paused = false
 
    Environment: Environment
    static Actions: Actions
    
    constructor(identifier: string | IService, token?: string) {
        if (!identifier) throw new Error('Parameter `identifier` must be of type string or IService.')
        this.#authToken = fn.checkValidToken(token)

        this.#serviceID = typeof identifier == 'string' ? identifier : identifier.id
        this.#serviceURL = `${fn.domain}/services/${this.#serviceID}`
        this.Environment = new Environment(this.#serviceID, this.#authToken)
    }

    async info(): Promise<IService | null> {
        const endpoint = `/services/${this.#serviceID}`,
              res = await fn.jsonRequest(endpoint, this.#authToken)

        if (!res.service) {
            console.error(`Request to ${endpoint} failed! Response:\n${res}`)
            return null
        }

        return res?.service
    }
    
    status = async () => {
        const { name, status } = await this.info()
        return `Status of app '${name}':\n ${status}`
    }

    currentDeployment = () => currentDeployment(this.#serviceID, this.#authToken)

    paused = async () => this.#paused || (await this.status()).includes('PAUSED') 
    async pause(): Promise<boolean> {
        if (this.paused()) return false // Already paused

        // No already paused, go ahead and pause.
        this.#paused = true
        await this.#runAction(Actions.PAUSE)
    }    

    async delete() {
        const res = await fn.sendRequest(`${this.#serviceURL}`, 
            fn.options(this.#authToken, 'DELETE')) as APIResponse

        return res?.statusCode == fn.STATUS_CODES.OK
    }

    resume = () => this.#paused ? false : this.#runAction(Actions.RESUME)
    redeploy = () => this.#runAction(Actions.REDEPLOY)

    #runAction = async (action: Actions | ActionType) => {
        const res = await fn.sendRequest(`${this.#serviceURL}/${action}`, 
              fn.options(this.#authToken, 'POST')) as APIResponse

        this.#paused = action == 'pause' ? true : false
        return res?.statusCode == fn.STATUS_CODES.OK
    }
}