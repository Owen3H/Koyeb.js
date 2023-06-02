import { jsonRequest, getToken } from "../utils/fn.cjs"
import { default as Service } from "./Service.ts"

export default class App {
    #appID: string
    #authToken: string

    constructor(token=getToken()) {
        if (!token) throw new Error('Invalid token or no global token set.')
        this.#authToken = token
    }

    static list = (token: string) => jsonRequest('/apps', token ?? getToken())
        .then(res => res.apps).catch(e => console.log(e))

    fromID = (id: string) => {
        if (!id) throw new Error("Parameter 'appID' is required!")
        this.#appID = id

        return this
    }

    fromName = async (name: string) => {
        if (!name) throw new Error("Parameter 'name' is required!")
        
        const apps = await App.list(this.#authToken)
        if (!apps) return

        const app = await apps.find((app: any) => app.name === name.trim())[0]
        if (!app) throw new Error(`Could not find app with name '${name}'`)

        this.#appID = app.id
        return this
    }

    fromIndex = async (index: number) => {
        if (!index && index != 0) throw new Error("Parameter 'index' is required!")

        const apps = await App.list(this.#authToken)
        const app = apps[index]

        if (!app) throw new RangeError(`App does not exist at index ${index}`)
        this.#appID = app.id

        return this
    }

    info = async () => {
        let res = await jsonRequest('/apps/' + this.#appID, this.#authToken)
        if (!res) return

        return res.app
    }

    Services = {
        all: async () => {
            let res = await jsonRequest('/services', this.#authToken)
            if (!res) return
    
            return res.services.filter((service: any) => service.app_id == this.#appID)
        },
        latest: async () => {
            const id = await this.Services.all().then(services => services[0].id)
            return new Service(id, this.#authToken)
        }
    }
}