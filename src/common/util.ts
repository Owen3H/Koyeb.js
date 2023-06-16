import { Dispatcher } from 'undici'
export type APIResponse = Dispatcher.ResponseData

export type ObjectValues<T> = T[keyof T]
export type StringifyObjectValues<T> = { 
    [key in keyof T]: T[key] extends string ? T[key] : string 
}

export type IAny = {
    "@type": string
    [key: string]: null | undefined | string | boolean | number | {} | []
}

export type ProtobufAny = {
    type_url: string | null
    value: Uint8Array | null
}