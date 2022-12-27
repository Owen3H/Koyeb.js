import WebSocket from 'ws'

export default class Instance {
    #instanceID = null
    #authToken = null

    constructor(id, token) {
        this.#instanceID = id
        this.#authToken = token
    }

    static latest = (token) => {

    }
    
    static get = (id, token) => {
        
    }

    static executeCommand = (id, token, body={command, ttyWidth, ttyHeight, data}) => {
        if (!body.command) throw new (`Must provide a command to execute on instance '${id}'`)
        //if (!body.data) throw new Error(`Data passed to instance '${id}' must be base64 encoded!`)

        return new Promise((resolve, reject) => {
            // Open websocket with auth header
            const socket = new WebSocket('wss://app.koyeb.com/v1/streams/instances/exec', ["Bearer", `${token}`])

            socket.on('open', () => { 
                socket.send(JSON.stringify({ id: id, body: body }))
            })

            socket.on('error', e => {
                socket.close()
                reject(e) 
            })
    
            socket.on("message", e => {
                const event = JSON.parse(e),
                      out = event?.result?.stdout

                socket.close()

                if (!out) resolve(event)
                else {
                    const msg = Buffer.from(out.data, 'base64')
                    resolve(msg.toString())
                }
            })
        })
    }

    executeCommand = async ({command, ttyWidth, ttyHeight, data}) => 
        Instance.executeCommand(this.#instanceID, this.#authToken, { command, ttyWidth, ttyHeight, data })
}