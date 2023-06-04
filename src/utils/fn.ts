import {Readable} from 'stream'
import { request, Dispatcher } from 'undici'

//#region Global token auth
let globalToken: string

const getToken = () => globalToken || null
const setToken = (token: string) => new Promise((resolve, reject) => {
    if (!token) return reject('Could not set global auth token! Token is invalid.')

    globalToken = token
    resolve(token)
}).catch(e => { throw new Error(e) })
//#endregion

//#region Simple helper vars
const isBase64 = (str: string = '') => encode(decode(str)) == str
const decode = (str: string) => Buffer.from(str, 'base64')
const encode = (buffer: Buffer) => buffer.toString('base64')

// interface ReqOptions {
//     method?: string
//     body?: string | Buffer | Uint8Array | Readable | null | FormData,
//     headers?: {
//         "Content-Type": string,
//         "Authorization": string
//     }
// }

const domain = 'https://app.koyeb.com/v1'
const options = (
    authToken: string, 
    reqMethod: string = 'GET', 
    body?: string | Buffer | Uint8Array | Readable | null | FormData
) => ({
    body,
    method: reqMethod,
    headers: {
        "Content-Type": "application/json; charset=UTF-8",
        "Authorization": `Bearer ${globalToken ?? authToken}`
    }
})
//#endregion

//#region URL/Request Helper Methods
const sendRequest = async (url: string | URL, opts?: any): Promise<Dispatcher.ResponseData> => {
    try { return await opts ? request(url, opts) : request(url) }
    catch (e) { console.error(e) }
}

const textRequest = (url: string | URL, opts: Dispatcher.DispatchOptions) => sendRequest(url, opts)
    .then(res => res.body.text()).catch(err => console.error(err))

const jsonRequest = (endpoint: string, token: string, method: string = 'GET') => sendRequest(domain + endpoint, options(token, method))
    .then(res => res.body.json()).catch(err => console.error(err))

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
    setToken, getToken
}