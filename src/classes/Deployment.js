module.exports = class Deployment {
    #deploymentID = null
    #authToken = null
    
    constructor(token) {
        this.#authToken = token
    }

    get = () => Deployment.get()
    static get() {

    }
}