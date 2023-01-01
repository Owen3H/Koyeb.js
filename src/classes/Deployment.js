module.exports = class Deployment {
    #deploymentID = null
    #authToken = null
    
    constructor(id, token) {
        if (!id) throw new Error(`Invalid id parameter '${id}'`)
        if (!token) throw new Error(`Invalid token parameter '${token}'`)

        this.#authToken = token
    }

    get = () => Deployment.get()
    static get() {
        
    }
}