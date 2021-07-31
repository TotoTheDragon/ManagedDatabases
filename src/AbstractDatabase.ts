import { AbstractBody } from "./AbstractBody";
import { SerializedData } from "./SerializedData";

export abstract class AbstractDatabase {

    abstract start(): Promise<void>; // Used to make a connection to a database, open a file stream etc.

    abstract removeObject(object: AbstractBody): Promise<void>;
    abstract saveObject(object: AbstractBody): Promise<void>;

    abstract selectObject(dummy: AbstractBody, identifiers: object): Promise<SerializedData>;
    abstract selectAllObjects(dummy: AbstractBody, identifiers: object): Promise<SerializedData[]>;
}