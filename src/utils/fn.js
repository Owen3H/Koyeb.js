const Undici = require("undici")

//#region Global token auth
var globalToken

const getToken = () => globalToken || null
const setToken = token => new Promise((resolve, reject) => {
    if (!token) return reject('Could not set global auth token! Token is invalid.')

    globalToken = token
    resolve(token)
}).catch(e => { throw new Error(e) })
//#endregion

//#region Simple helper vars
const domain = 'https://app.koyeb.com/v1'
const options = (authToken, reqMethod='GET') => ({
    method: reqMethod,
    headers: {
        Authorization: `Bearer ${globalToken ?? authToken}`
    }
})
//#endregion

//#region URL/Request Helper Methods
const sendRequest = async (url, headers) => {
    try { return await Undici.request(url, headers) } 
    catch (e) { return console.error(e) }
}

const jsonRequest = (endpoint, token, method='GET') => 
    sendRequest(domain + endpoint, options(token, method))
        .then(res => res.body.json())
        .catch(err => console.error(err))

const buildURL = (url, params) => {
    url = new URL(url)
    params = new URLSearchParams(params)
    
    url.search = params.toString()
    return url
}
//#endregion

module.exports = {
    domain, options, 
    buildURL, sendRequest, jsonRequest, 
    setToken, getToken
}