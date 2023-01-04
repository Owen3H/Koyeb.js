const fn = require('../utils/fn'),
      Console = require('../utils/Console')

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
    static async latest(token) {
        const res = await fn.jsonRequest('/instances?limit=1', token)
        return res?.instances ? res.instances[0] : console.error(`Failed to get latest instance!\nResponse:\n${res}`)
    }

    get = () => Instance.get(this.#instanceID, this.#authToken)
    static async get(id, token) {
        const res = await fn.jsonRequest(`/instances/${id}`, token)
        return res?.instance ?? console.error(`Failed to get instance: ${id}\nResponse:\n${res}`)
    }

    executeCommand = (body={command, ttyWidth, ttyHeight, data}) => 
        Instance.executeCommand(this.#instanceID, this.#authToken, body)

    static executeCommand = (id, token, body={command, ttyWidth, ttyHeight, data}) => {
        if (!body.command || body.command.length < 1) 
            throw new (`Cannot execute empty or invalid command on instance: ${id}`)

        //if (!body.data) throw new Error(`Data passed to instance '${id}' must be base64 encoded!`)

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

        return Console.exec('wss://app.koyeb.com/v1/streams/instances/exec', token, msg)
    }
}