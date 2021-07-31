import { AbstractStorage } from "./AbstractStorage";
import { SerializableObject } from "./SerializableObject";
import { SerializedData } from "./SerializedData";
import { makeArray, Removeable, Saveable } from "./util";

export abstract class AbstractBody implements SerializableObject, Saveable, Removeable {

    storage: AbstractStorage<AbstractBody>;
    cache: SerializedData;

    constructor(storage: AbstractStorage<AbstractBody>) {
        this.storage = storage;
    }

    save(): Promise<void> {
        return this.storage.database.saveObject(this);
    }

    remove(): Promise<void> {
        return this.storage.database.removeObject(this);
    }

    abstract getCollection(): string;

    getIdentifiers(): object {
        const ret = {};
        const values: any[] = makeArray(this.getIdentifierValues());
        makeArray(this.getIdentifier()).forEach((v, i) => ret[v] = values[i]);
        return ret;
    }

    updateCache(): void {
        this.cache = new SerializedData(this);
    }

    abstract getIdentifier(): string | string[];

    abstract getIdentifierValues(): any | any[];

    abstract getFields(): string[];

    abstract serialize(data: SerializedData): void;
    abstract deserialize(data: SerializedData): void;

}