const Undici = require("undici")

//#region Global token auth
let globalToken

const getToken = () => globalToken || null
const setToken = token => new Promise((resolve, reject) => {
    if (!token) return reject('Could not set global auth token! Token is invalid.')

    globalToken = token
    resolve(token)
}).catch(e => { throw new Error(e) })
//#endregion

//#region Simple helper vars
const isBase64 = (str='') => encode(decode(str)) == str
const decode = str => Buffer.from(str, 'base64')
const encode = buffer => buffer.toString('base64')

const domain = 'https://app.koyeb.com/v1'
const options = (authToken, reqMethod='GET', body=null) => ({
    method: reqMethod,
    body: body,
    headers: {
        "Content-Type": "application/json; charset=UTF-8",
        Authorization: `Bearer ${globalToken ?? authToken}`
    }
})
//#endregion

//#region URL/Request Helper Methods
const sendRequest = async (url, opts) => {
    try { return await Undici.request(url, opts) } 
    catch (e) { return console.error(e) }
}

const textRequest = (url, opts) => sendRequest(url, opts)
    .then(res => res.body.text()).catch(err => console.error(err))

const jsonRequest = (endpoint, token, method='GET') => sendRequest(domain + endpoint, options(token, method))
    .then(res => res.body.json()).catch(err => console.error(err))

const buildURL = (url, params) => {
    url = new URL(url)
    params = new URLSearchParams(params)
    
    url.search = params.toString()
    return url
}
//#endregion

module.exports = {
    domain, options, 
    buildURL, sendRequest, textRequest, jsonRequest, 
    isBase64, decode, encode,
    setToken, getToken,
}