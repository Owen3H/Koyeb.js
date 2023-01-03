const WebSocket = require('ws')

class Console extends WebSocket {
    constructor(url, options) {
        super(url, options)
    }

    sendJSON = msg => {
        if (!msg) return `Invalid message '${msg}' could not be executed!`

        this.on('open', () => this.send(JSON.stringify(msg)))
        return this
    }
}

const exec = (url, token, msg) => new Promise((resolve, reject) => {
    const cs = new Console(url, ["Bearer", `${token}`]).on('error', e => {
        cs.close()
        reject(e) 
    })

    let sent = cs.sendJSON(msg)
    if (!sent) reject(sent)
    
    .on('message', e => {
        const event = JSON.parse(e),
              out = event?.result?.stdout

        cs.close()

        if (!out) resolve(event)
        else {
            const msg = Buffer.from(out.data, 'base64')
            resolve(msg.toString())
        }
    })
})

module.exports = {
    Console, exec
}