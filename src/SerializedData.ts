import { SerializableObject } from "./SerializableObject";
import { getAsJSON, getAsPrimitive, stringToBoolean } from "./util";

export class SerializedData {

    json: any;

    constructor(object?: any) {
        this.json = {};

        /* Object is SerializableObject */
        if (typeof object?.serialize === "function")
            return object.serialize(this);

        /* Object is json */
        if (typeof object === "object")
            Object.keys(object).forEach(v => this.write(v, object[v]));
    }

    write(key: string, value: any): SerializedData {

        const type = typeof value;

        if (value === undefined) this.json[key] = undefined;
        else if (value === null) this.json[key] = null;
        else if (type !== "object" && type !== "function" || value === null) this.json[key] = value; // Value is string, number, bigint or boolean
        else if (value.toJSON !== undefined) this.json[key] = value.toJSON(); // Value is SerializedData
        else if (value.serialize !== undefined) this.json[key] = new SerializedData(value).toJSON(); // Value is SerializableObject
        else if (value.values !== undefined) this.json[key] = [...value.values()]; // Value is similar to array
        else if (type === "function") this.json[key] = value(); // Value is function
        else if (type === "object") this.json[key] = value; // Value is json

        return this;
    }

    applyAs<T>(key: string, type?: string): T {
        return this.get(key, type);
    }

    get(key: string, type: string | any = "string"): any {
        if (this.json[key] === undefined) return undefined;
        if (this.json[key] === null) return null;

        if (typeof type === "string") {
            switch (type) {
                case "string":
                    return this.json[key]?.toString() ?? this.json[key];
                case "number":
                    return parseFloat(this.json[key]);
                case "bigint":
                    return BigInt(this.json[key]);
                case "boolean":
                    return stringToBoolean(this.get(key, "string"));
                case "json":
                    return getAsJSON(this.json[key]);
                case "primitive":
                    return getAsPrimitive(this.json[key]);
                case "stringified":
                    return JSON.stringify(this.get(key, "json"));
                default:
                    return this.json[key];
            }
        }

        try {
            const val: SerializableObject = new type();
            val.deserialize(new SerializedData(this.get(key, "json")));
            return val;
        } catch {
            return undefined;
        }
    }

    hasKey(key: string): boolean {
        return Object.keys(this.json).includes(key);
    }

    has(key: string): boolean {
        return this.hasKey(key) && this.json[key] != null;
    }

    toJSON(): any {
        return this.json;
    }
}