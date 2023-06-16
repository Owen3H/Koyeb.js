import * as fn from "../utils/fn.js"

import { IApp, IService } from "../types.js"
import { Service } from "./Service.js"

export class App {
    #appID: string
    #authToken: string

    constructor(token?: string) {
        this.#authToken = fn.checkValidToken(token)
    }

    static list = async (token?: string) => await fn.jsonRequest('/apps', token)
            .then(res => res.apps).catch(console.error) as IApp[]

    fromID = (id: string) => {
        if (!id) throw new Error('Parameter `id` is invalid! App ID must be a string.')
        this.#appID = id

        return this
    }

    fromName = async (name: string) => {
        if (!name) throw new Error('Parameter `name` is required!')
        
        const apps = await App.list(this.#authToken)
        if (!apps) throw new Error('Unable to fetch app list!')

        const app = await apps.find((app: IApp) => app.name === name.trim())
        if (!app) throw new Error(`Could not find app with name \`${name}\``)

        this.#appID = app.id
        return this
    }

    fromIndex = async (index: number) => {
        if (!index && index != 0) throw new Error("Parameter `index` is required!")

        const apps = await App.list(this.#authToken)
        const app = apps[index]

        if (!app) throw new RangeError(`App does not exist at index ${index}`)
        this.#appID = app.id

        return this
    }

    info = async () => {
        const res = await fn.jsonRequest(`/apps/${this.#appID}`, this.#authToken)
        if (!res) return

        return res.app as IApp
    }

    Services = {
        all: async () => {
            const res = await fn.jsonRequest('/services', this.#authToken)
            if (!res) return
    
            return (res.services as IService[]).filter(service => service.app_id == this.#appID)
        },
        latest: async (): Promise<Service> => {
            const id = await this.Services.all().then(services => services[0].id)
            return new Service(id, this.#authToken)
        }
    }
}