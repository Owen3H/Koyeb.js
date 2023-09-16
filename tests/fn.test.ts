import { describe, expect, it } from 'vitest'

import {
    getGlobalToken,
    setGlobalToken
} from '../src/koyeb'

describe('global token', () => {
    const token = "example69Koyeb420Token"

    it('can be correctly set via helper method', async () => {
        // Shouldn't already be set.
        expect(getGlobalToken()).toBeNull()

        // Set and get new token value
        const newToken = await setGlobalToken(token)

        // It should now be set to the value in our .env
        expect(newToken).toBeDefined()
        expect(newToken).toBeTypeOf("string")
    })

    it('can be retrieved via helper method', async () => {
        const token = getGlobalToken()

        expect(token).toBeDefined()
        expect(token).toBeTypeOf("string")
    })
})