export class DataPair<K, V> {
    key: K;
    value: V;

    constructor(key: K, value: V) {
        this.key = key;
        this.value = value;
    }
}

export interface Loadable {
    load(): Promise<void>;
}

export interface Saveable {
    save(): Promise<void>;
}

export interface Removeable {
    remove(): Promise<void>;
}

export interface Cacheable {
    cache(identifiers: object, createIfNotExists?: boolean): Promise<any>;
    cacheAll(identifiers: object): Promise<any[]>;
}

export function stringToBoolean(str: string) {
    switch (str.toLowerCase().trim()) {
        case "true":
        case "yes":
        case "1":
            return true;
        case "false":
        case "no":
        case "0":
        case null:
            return false;
        default:
            return Boolean(str);
    }
}

export function getAsJSON(input: any): object {
    if (typeof input === "object")
        return input;
    try {
        if (typeof input === "string")
            return JSON.parse(input.replace(/\n/g, "\\n"));
        return JSON.parse(input.toString());
    } catch {
        return undefined;
    }
}

export function getAsPrimitive(input: any): any {
    if (typeof input === "object") return JSON.stringify(input);
    return input;
}

export function makeArray(input: any): any[] {
    if (Array.isArray(input)) return input;
    return Array.of(input);
}