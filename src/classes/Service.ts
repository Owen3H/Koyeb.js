import * as fn from "../utils/fn.cjs"
import { currentDeployment, Environment } from "./Environment.ts"

import * as Undici from "undici"

type ActionType = 'pause' | 'resume' | 'redeploy'
const enum Actions {
    PAUSE = 'pause',
    RESUME = 'resume',
    REDEPLOY = 'redeploy'
}

export default class Service {
    #authToken: string

    #serviceID: string | number
    #serviceURL: string

    #paused: boolean = false
 
    Environment: Environment
    static Actions: Actions
    
    constructor(id: string | number, token: string) {
        if (!id) throw new Error(`Invalid id parameter '${id}'`)
        if (!token) throw new Error(`Invalid token parameter '${token}'`)

        this.#serviceID = id
        this.#authToken = token

        this.#serviceURL = `${fn.domain}/services/${this.#serviceID}`
        this.Environment = new Environment(this.#authToken, this.#serviceID, this.#serviceURL)
    }

    async info() : Promise<IService> {
        const endpoint = `/services/${this.#serviceID}`,
              res = await fn.jsonRequest(endpoint, this.#authToken)

        return res?.service ?? console.error(`Request to ${endpoint} failed! Response:\n${res}`)
    }
    
    status = async () => {
        let { name, status } = await this.info()
        return `Status of app '${name}':\n ${status}`
    }

    currentDeployment = () => currentDeployment(this.#serviceID)

    paused = async () => this.#paused || (await this.status()).includes('PAUSED') 
    pause() {
        if (this.#paused) return false

        this.#paused = true
        this.#runAction(Actions.PAUSE)
    }    

    delete = async () => {
        const res = await fn.sendRequest(`${this.#serviceURL}`, fn.options(this.#authToken, 'DELETE')) as Undici.Dispatcher.ResponseData
        return res?.statusCode == 200
    }

    resume = () => this.#paused ? false : this.#runAction(Actions.RESUME)
    redeploy = () => this.#runAction(Actions.REDEPLOY)

    #runAction = async (action: Actions | ActionType) => {
        let res = await fn.sendRequest(`${this.#serviceURL}/${action}`, fn.options(this.#authToken, 'POST')) as Undici.Dispatcher.ResponseData

        this.#paused = action == 'pause' ? true : false
        return res?.statusCode == 200
    }
}