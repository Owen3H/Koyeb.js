const WebSocket = require('ws'),
      fn = require('../utils/fn')

module.exports = class Instance {
    #instanceID = null
    #authToken = null

    constructor(id, token) {
        if (!id) throw new Error(`Invalid id parameter '${id}'`)
        if (!token) throw new Error(`Invalid token parameter '${token}'`)

        this.#instanceID = id
        this.#authToken = token
    }

    latest = () => Instance.latest(this.#authToken)
    static latest = async (token) => {
        const res = await fn.jsonRequest('/instances?limit=1', token)
        return res.instances[0]
    }

    get = () => Instance.get(this.#instanceID, this.#authToken)
    static get = async (id, token) => {
        const res = await fn.jsonRequest(`/instances/${id}`, token)
        return res.instance
    }

    executeCommand = (body={command, ttyWidth, ttyHeight, data}) => 
        Instance.executeCommand(this.#instanceID, this.#authToken, body)

    static executeCommand = (id, token, body={command, ttyWidth, ttyHeight, data}) => {
        if (!body.command) throw new (`Must provide a command to execute on instance '${id}'`)
        //if (!body.data) throw new Error(`Data passed to instance '${id}' must be base64 encoded!`)

        return new Promise((resolve, reject) => {
            // Open websocket with auth header
            const socket = new WebSocket('wss://app.koyeb.com/v1/streams/instances/exec', ["Bearer", `${token}`])
            
            const msg = { 
                id: id, 
                body: {
                    command: body.command,
                    stdin: { data: body.data },
                    tty_size: {
                        height: body.ttyHeight,
                        width: body.ttyWidth
                    }
                }
            }

            socket.on('open', () => { 
                socket.send(JSON.stringify(msg))
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
}