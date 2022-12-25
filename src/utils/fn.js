import { request } from "undici"

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

export default {
    domain, options, 
    sendRequest, jsonRequest
}