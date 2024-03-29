import { Readable } from 'stream'
import { request, Dispatcher, FormData } from 'undici'
import { AuthError } from './errors.js'
import { HttpMethod, ReqOptions } from '../types.js'

//#region Token Authentication
let globalToken: string

const getToken = () => globalToken || null
const setToken = (token: string): Promise<string> => new Promise((resolve, reject) => {
    if (!token) return reject('Could not set global auth token! Token is invalid.')

    globalToken = token
    resolve(token)
})

const checkValidToken = (token: string) => {
    if (!token) {
        token = getToken()
        if (!token) throw new AuthError(AuthError.MISSING_TOKEN)
    }

    return token
}
//#endregion

//#region Simple helper vars
const isBase64 = (str: string = '') => encode(decode(str)) == str
const decode = (str: string) => Buffer.from(str, 'base64')
const encode = (buffer: Buffer) => buffer.toString('base64')
const STATUS_CODES = {
    OK: 200,
    VALIDATION_ERROR: 400,
    NO_PERMISSION: 403,
    EMPTY_RESOURCE: 404
} as const

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
const sendRequest = async (
    url: string | URL, 
    opts?: ReqOptions
): Promise<any> => {
    try { return await opts ? request(url, opts) : request(url) }
    catch(e) { console.error(e) }
}

async function textRequest(url: string | URL, opts: Dispatcher.DispatchOptions) {
    let res = null
    try { res = await sendRequest(url, opts) }
    catch(e) { console.error(e) }

    return res?.body.text() as Promise<string>
} 

async function jsonRequest(
    endpoint: string, 
    token?: string, 
    method: HttpMethod = 'GET'
): Promise<any> {
    let res = null
    try { res = await sendRequest(domain + endpoint, options(token, method)) }
    catch(e) { console.error(e) }

    return res?.body.json() as any
}

const buildURL = (url: string, params: object | string | URLSearchParams | Record<string, string>) => {
    const _url = new URL(url)
    params = new URLSearchParams(params as any)
    
    _url.search = params.toString()
    return _url
}
//#endregion

export {
    domain, options, 
    buildURL, sendRequest, textRequest, jsonRequest, 
    isBase64, decode, encode,
    setToken, getToken, checkValidToken,
    STATUS_CODES
}