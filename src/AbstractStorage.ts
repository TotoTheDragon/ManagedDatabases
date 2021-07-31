import { AbstractBody } from "./AbstractBody";
import { AbstractDatabase } from "./AbstractDatabase";
import { StorageHolder } from "./StorageHolder";
import { Cacheable, Loadable, Saveable } from "./util";

export abstract class AbstractStorage<T extends AbstractBody> implements Cacheable, Loadable, Saveable {

    holder: StorageHolder;
    database: AbstractDatabase;
    readonly _holds: any;

    constructor(holder: StorageHolder, database: AbstractDatabase, holds: any) {
        this.holder = holder;
        this.database = database;
        this._holds = holds;
    }

    getDummy(): T {
        return new this._holds(this);
    }

    save(): Promise<void> {
        return new Promise(async resolve => {
            await Promise.all(this.getValues().map(object => object.save()));
            resolve();
        })
    }

    remove(object: T): Promise<void> {
        return new Promise(async resolve => {
            await this.onRemove(object);
            await object.remove();
            resolve();
        })
    }

    add(identifiers: object, object: T | Promise<T>): Promise<void> {
        return new Promise(async resolve => {
            if (object instanceof Promise) (object as Promise<T>).then(obj => obj.save());
            else object.save();
            await this.onAdd(identifiers, object);
            resolve();
        })
    }

    async onRegister(): Promise<any> { } // Used to set up

    abstract onAdd(identifiers: object, object: T | Promise<T>): Promise<void>;
    abstract onRemove(identifiers: T | object): Promise<void>;

    abstract cache(identifiers: object, createIfNotExists?: boolean): Promise<any>;
    abstract cacheAll(identifiers: object): Promise<any[]>;
    abstract load(): Promise<void>;

    abstract getFromCache(identifiers: object): T | Promise<T>;

    abstract getValues(): T[];

    register(holder: StorageHolder): Promise<void> {
        this.holder = holder;
        holder.storages.set(this.getDummy().getCollection(), this);
        return this.onRegister();
    }
}