import * as fn from "../utils/fn.ts"
import { default as Service } from "./Service.ts"

export default class App {
    #appID: string
    #authToken: string

    constructor(token?: string) {
        this.#authToken = fn.checkValidToken(token)
    }

    static list = async (token?: string) => await fn.jsonRequest('/apps', token)
            .then(res => res.apps).catch(console.error)

    fromID = (id: string) => {
        if (!id) throw new Error('Parameter `id` is invalid! Make sure to pass your App ID as a string.')
        this.#appID = id

        return this
    }

    fromName = async (name: string) => {
        if (!name) throw new Error('Parameter `name` is required!')
        
        const apps = await App.list(this.#authToken)
        if (!apps) throw new Error('Unable to fetch app list!')

        const app = await apps.find((app: any) => app.name === name.trim())[0]
        if (!app) throw new Error(`Could not find app with name \`${name}\``)

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
        let res = await fn.jsonRequest(`/apps/${this.#appID}`, this.#authToken)
        if (!res) return

        return res.app
    }

    Services = {
        all: async () => {
            let res = await fn.jsonRequest('/services', this.#authToken)
            if (!res) return
    
            return res.services.filter((service: any) => service.app_id == this.#appID)
        },
        latest: async () => {
            const id = await this.Services.all().then(services => services[0].id)
            return new Service(id, this.#authToken)
        }
    }
}