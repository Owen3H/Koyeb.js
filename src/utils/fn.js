const Undici = require("undici")

var globalToken

const getToken = () => globalToken
const setToken = token => new Promise((resolve, reject) => {
    console.log(token)

    if (!token) reject('Could not set global auth token! Token is invalid.')
    else {
        globalToken = token
        resolve(token)
    }
}).catch(e => { throw new Error(e) })

const domain = 'https://app.koyeb.com/v1'
const options = (authToken, reqMethod='GET') => ({
    method: reqMethod,
    headers: {
        Authorization: `Bearer ${globalToken ?? authToken}`
    }
})

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

module.exports = {
    domain, options, 
    buildURL, sendRequest, jsonRequest, 
    setToken, getToken
}