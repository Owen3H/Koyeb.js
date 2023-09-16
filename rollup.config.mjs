import pkg from './package.json' assert { type: 'json' }
import json from '@rollup/plugin-json'

import resolve from '@rollup/plugin-node-resolve'
import esbuild from 'rollup-plugin-esbuild'
import commonjs from '@rollup/plugin-commonjs'

import { typescriptPaths } from 'rollup-plugin-typescript-paths'

import nodePolyfills from 'rollup-plugin-polyfill-node'

const generatedCode = {
    arrowFunctions: true,
    constBindings: true,
    objectShorthand: true
}

const esm = {
    generatedCode,
    file: pkg.exports.import,
    format: 'es'
}

const cjs = {
    generatedCode,
    file: pkg.exports.require,
    format: 'cjs'
}

const source = {
	input: 'src/koyeb.ts',
	external: [...Object.keys(pkg.dependencies)],
    output: [esm, cjs],
    plugins: [
        typescriptPaths({ preserveExtensions: true }),
        json(),
        nodePolyfills(),
        resolve({ preferBuiltins: true }),
        commonjs({ requireReturnsDefault: 'auto' }),
        esbuild({ exclude: ["**/*.test.ts"] })
    ]
}

export default [source]