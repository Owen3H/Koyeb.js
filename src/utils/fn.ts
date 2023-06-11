import { Readable } from 'stream'
import { request, Dispatcher } from 'undici'
import { AuthError } from './errors'

//#region Token Authentication
let globalToken: string

const getToken = () => globalToken || null
const setToken = (token: string) => new Promise((resolve, reject) => {
    if (!token) return reject('Could not set global auth token! Token is invalid.')

    globalToken = token
    resolve(token)
}).catch(console.error)

const checkValidToken = (token: string) => {
    var validToken: string
    if (!token) {
        validToken = getToken()
        if (!validToken) throw new AuthError(AuthError.MISSING_TOKEN)
    }

    return validToken
}
//#endregion

//#region Simple helper vars
const isBase64 = (str: string = '') => encode(decode(str)) == str
const decode = (str: string) => Buffer.from(str, 'base64')
const encode = (buffer: Buffer) => buffer.toString('base64')

const domain = 'https://app.koyeb.com/v1'
const options = (
    authToken: string, 
    reqMethod: HttpMethod = 'GET', 
    body?: string | Buffer | Uint8Array | Readable | null | FormData,
    path?: string
) => ({
    body, path,
    method: reqMethod,
    headers: {
        "Authorization": `Bearer ${checkValidToken(authToken)}`,
        "Content-Type": "application/json; charset=UTF-8"
    }
} as ReqOptions)
//#endregion

//#region URL/Request Helper Methods
const sendRequest = async (url: string | URL, opts?: ReqOptions) => {
    try { return await opts ? request(url, opts) : request(url) }
    catch(e) { console.error(e) }
}

async function textRequest(url: string | URL, opts: Dispatcher.DispatchOptions) {
    try { var res = await sendRequest(url, opts) }
    catch(e) { console.error(e) }

    return res?.body.text() as Promise<string>
} 

async function jsonRequest(endpoint: string, token?: string, method: HttpMethod = 'GET') {
    try { var res = await sendRequest(domain + endpoint, options(token, method)) }
    catch(e) { console.error(e) }

    return res?.body.json()
}

const buildURL = (url: string | URL, params: {} | string | URLSearchParams | Record<string, string>) => {
    url = new URL(url)
    params = new URLSearchParams(params)
    
    url.search = params.toString()
    return url
}
//#endregion

export {
    domain, options, 
    buildURL, sendRequest, textRequest, jsonRequest, 
    isBase64, decode, encode,
    setToken, getToken, checkValidToken 
}