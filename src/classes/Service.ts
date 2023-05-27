const fn = require("../utils/fn")

const currentDeployment = (id: string | number) => 
    fn.jsonRequest(`/deployments?service_id=${id}`).then((arr: DeploymentList) => arr.deployments[0])

class Environment {
    #authToken: string

    #serviceID: string | number
    #serviceURL: string
    
    #deployment: Deployment
    #vars: DeploymentEnv[]
    
    constructor(token: string, id: string | number, url: string) {
        this.#authToken = token
        this.#serviceID = id
        this.#serviceURL = url
    }

    async #sendUpdate() {
        // Send patch request with updated definition
        const body = JSON.stringify({ "definition": this.#deployment.definition })
        return await fn.textRequest(this.#serviceURL, fn.options(this.#authToken, 'PATCH', body))
    }

    async #filterVars(key: string) {
        this.#deployment = await currentDeployment(this.#serviceID)
        this.#vars = this.#deployment.definition?.env ?? []

        // Filter out vars that don't match the key name.
        return this.#vars.filter(v => v.key === key)
    }

    deleteVariable = async (key: string) => {
        let arr = await this.#filterVars(key),
            index = this.#vars.indexOf(arr[0])

        delete this.#vars[index]
        await this.#sendUpdate()
    }

    setVariable = async (key: string, value: string) => {
        let arr = await this.#filterVars(key),
            index = this.#vars.indexOf(arr[0])

        // Add or update key
        if (arr.length) this.#vars[index]['value'] = value
        else this.#vars.push({ scopes: this.#vars[0].scopes, key, value })

        await this.#sendUpdate()
    }
}

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



    async info() {
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

    resume = () => this.#paused ? false : this.#runAction(Actions.RESUME)
    redeploy = () => this.#runAction(Actions.REDEPLOY)

    #runAction = async (action: Actions | ActionType) => {
        let res = await fn.sendRequest(`${this.#serviceURL}/${action}`, fn.options(this.#authToken, 'POST'))

        this.#paused = action == 'pause' ? true : false
        return res?.statusCode == 200
    }
}