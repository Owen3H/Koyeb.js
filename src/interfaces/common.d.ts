interface KeyValue {
    key: string
    value: string
}

interface WsCommandBody {
    command: string[],
    /** Must be Base64 encoded! */
    data?: string,
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