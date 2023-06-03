import * as fn from '../utils/fn.js'
import { Console, exec } from '../utils/Console.js'

export default class Instance {
    #instanceID: string
    #authToken: string

    static #consoleWs: Console
    
    constructor(id: string, token=fn.getToken()) {
        if (!id) throw new Error(`Invalid id parameter '${id}'`)
        if (!token) throw new Error(`Invalid token parameter '${token}'`)

        this.#instanceID = id
        this.#authToken = token

        Instance.#initConsoleWs(token)
    }

    static #initConsoleWs = (token: string) => {
        const url = 'wss://app.koyeb.com/v1/streams/instances/exec'
        Instance.#consoleWs = new Console(url, token).on('error', () => {
            Instance.#consoleWs.close()
        })
    }

    latest = () => Instance.latest(this.#authToken)
    static async latest(token: string) {
        const res = await fn.jsonRequest('/instances?limit=1', token)
        return res?.instances ? res.instances[0] : console.error(`Failed to get latest instance!\nResponse:\n${res}`)
    }

    get = () => Instance.get(this.#instanceID, this.#authToken)
    static async get(id: string, token: string) {
        const res = await fn.jsonRequest(`/instances/${id}`, token)
        return res?.instance ?? console.error(`Failed to get instance: ${id}\nResponse:\n${res}`)
    }

    executeCommand = (body: WsCommandBody) => Instance.executeCommand(this.#instanceID, body)
    static executeCommand = (id: string, body: WsCommandBody, token?: string) => {
        let { command, data, ttyHeight, ttyWidth } = body

        if (!command) throw new Error(`Cannot execute invalid command on instance: ${id}`)
        if (command.length < 1) throw new Error(`Cannot execute empty command on instance: ${id}`)

        //if (!data) throw new Error(`Invalid parameter 'data' cannot be passed to instance: ${id}`)

        // If decoded matches original, data is already encoded.
        const encoded = fn.isBase64(data) ? data : fn.encode(data) 
        const msg = { 
            id: id, 
            body: {
                command: command,
                stdin: { data: encoded },
                tty_size: {
                    height: ttyHeight,
                    width: ttyWidth
                }
            }
        }
        
        if (!this.#consoleWs) {
            Instance.#initConsoleWs(token)
            if (!this.#consoleWs) throw new Error('Cannot execute command! Console websocket has not been initialized.')
        }

        return exec(this.#consoleWs, msg)
    }
}