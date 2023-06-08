import * as fn from "../utils/fn.js"

const currentDeployment = (id: string, token: string) =>
    fn.jsonRequest(`/deployments?service_id=${id}`, token).then((arr: DeploymentList) => arr.deployments[0])
    
class Environment {
    #authToken: string

    #serviceID: string
    #serviceURL: string
    
    #deployment: IDeployment
    #vars: DeploymentEnv[]
    
    constructor(id: string, token?: string) {
        this.#authToken = fn.checkValidToken(token)
        if (!id) throw new Error(`Invalid id parameter '${id}'`)

        this.#serviceID = id
        this.#serviceURL = `${fn.domain}/services/${id}`
    }

    async #sendUpdate() {
        // Send patch request with updated definition
        const body = JSON.stringify({ "definition": this.#deployment.definition })
        return await fn.textRequest(this.#serviceURL, fn.options(this.#authToken, 'PATCH', body))
    }

    async #filterVars(key: string) {
        this.#deployment = await currentDeployment(this.#serviceID, this.#authToken)
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

export {
    Environment,
    currentDeployment
}