import WebSocket from 'ws'

class Console extends WebSocket {
    constructor(url: string, token: string) {
        super(url, ["Bearer", `${token}`])
    }

    sendJSON = (msg: WsMessage) => {
        if (!msg) return `Invalid message '${msg}' could not be executed!`

        this.on('open', () => this.send(JSON.stringify(msg)))
        return this
    }
}

const exec = (ws: Console, msg: WsMessage) => new Promise((resolve, reject) => {
    let sent = ws.sendJSON(msg)
    if (!sent) reject(sent)
    
    ws.on('message', (e: any) => {
        const event = JSON.parse(e),
              out = event?.result?.stdout

        ws.close()

        if (!out) resolve(event)
        else {
            const msg = Buffer.from(out.data, 'base64')
            resolve(msg.toString())
        }
    })
})

export {
    Console, exec
}