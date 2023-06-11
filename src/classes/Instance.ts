import * as fn from '../utils/fn'
import { Console, exec } from './Console'

export default class Instance {
    #instanceID: string
    #authToken: string

    static #consoleWs: Console
    
    constructor(id: string, token?: string) {
        if (!id) throw new Error(`Invalid id parameter '${id}'`)

        this.#instanceID = id
        this.#authToken = fn.checkValidToken(token)

        Instance.#initConsoleWs(token)
    }

    static #initConsoleWs = (token: string) => {
        const validToken = fn.checkValidToken(token)
        const url = 'wss://app.koyeb.com/v1/streams/instances/exec'
        
        this.#consoleWs = new Console(url, validToken)
            .on('error', () => this.#consoleWs.close())
    }

    latest = () => Instance.latest(this.#authToken)
    static async latest(token?: string) {
        const res = await fn.jsonRequest('/instances?limit=1', token)
        
        return res?.instances ? res.instances[0] : 
            console.error(`Failed to get latest instance!\nResponse:\n${res}`)
    }

    get = () => Instance.get(this.#instanceID, this.#authToken)
    static async get(id: string, token?: string) {
        const res = await fn.jsonRequest(`/instances/${id}`, token)
        return res?.instance ?? console.error(`Failed to get instance: ${id}\nResponse:\n${res}`)
    }

    executeCommand = (body: WsCommandBody) => Instance.executeCommand(this.#instanceID, body, this.#authToken)
    static executeCommand = (id: string, body: WsCommandBody, token?: string) => {
        let { command, data, ttyHeight, ttyWidth } = body

        if (!command) throw new Error(`Cannot execute invalid command on instance: ${id}`)
        if (command.length < 1) throw new Error(`Cannot execute empty command on instance: ${id}`)

        //if (!data) throw new Error(`Invalid parameter 'data' cannot be passed to instance: ${id}`)

        //#region Try encode the data if not already base64.
        if (data instanceof Buffer) data = fn.encode(data)
        else data = fn.isBase64(data) ? data : null
        //#endregion

        const msg = { 
            body: {
                command,
                stdin: { data },
                tty_size: {
                    height: ttyHeight,
                    width: ttyWidth
                }
            }, id
        }
        
        if (!this.#consoleWs) {
            this.#initConsoleWs(token)
            if (!this.#consoleWs) throw new Error('Cannot execute command! Console websocket has not been initialized.')
        }

        return exec(this.#consoleWs, msg)
    }
}