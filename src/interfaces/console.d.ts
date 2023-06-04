interface WsCommandBody {
    command: string[],
    /** Must be Base64 encoded! */
    data?: string | Buffer,
    ttyHeight?: number,
    ttyWidth?: number
}

interface WsMessage {
    id: string, 
    body: {
        command: string[],
        stdin: { data: string },
        tty_size: {
            height: number,
            width: number
        }
    }
}