const options = (authToken, reqMethod='GET') => ({
    headers: {
        Authorization: `Bearer ${authToken}`,
        method: reqMethod
    }   
})

export default {
    options,
    domain: 'https://app.koyeb.com/v1'
}