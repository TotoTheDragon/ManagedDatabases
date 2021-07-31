import { AbstractStorage } from "./AbstractStorage";
import { Loadable, Saveable } from "./util";

export class StorageHolder implements Loadable, Saveable {

    storages: Map<string, AbstractStorage<any>>;

    constructor() {
        this.storages = new Map();
    }

    async register(storage: AbstractStorage<any>): Promise<void> {
        return storage.register(this);
    }

    get(collection: string) {
        return this.storages.get(collection)
    }

    getByType<T extends any>(dummy: T): any {
        return this.getStorages().find(storage => storage.getDummy() instanceof dummy.constructor);
    }

    async save(): Promise<void> {
        await Promise.all([]);
    }
    async load(): Promise<void> {
        await Promise.all([]);
    }

    getStorages(): any[] {
        return Array.from(this.storages.values());
    }
}