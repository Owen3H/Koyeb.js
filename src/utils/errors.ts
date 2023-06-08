class AuthError extends Error {
    public static MISSING_TOKEN: string = 
        'Cannot initialize console! Did you forget to pass the `token` parameter?\n' +
        'Alternatively, you can set a global token using Koyeb.setToken().'

    constructor(message: string) {
        super(message)

        Object.setPrototypeOf(this, AuthError.prototype)
        this.name = "AuthError"
    }
}

export {
    AuthError
}