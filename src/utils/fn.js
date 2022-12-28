const { request } = require("undici")

const domain = 'https://app.koyeb.com/v1'
const options = (authToken, reqMethod='GET') => ({
    method: reqMethod,
    headers: {
        Authorization: `Bearer ${authToken}`
    }
})

const sendRequest = async (url, headers) => {
    try { return await request(url, headers) } 
    catch (e) { return console.error(e) }
}

const jsonRequest = async (endpoint, token, method='GET') => sendRequest(domain + endpoint, options(token, method))
    .then(res => res.body.json()).catch(err => console.error(err))

const buildURL = (url, params) => {
    url = new URL(url)
    params = new URLSearchParams(params)
    
    url.search = params.toString()
    return url
}

module.exports = {
    domain, options, 
    sendRequest, jsonRequest, 
    buildURL
}