import { SerializedData } from "./SerializedData";

export interface SerializableObject {
    serialize(data: SerializedData): void;
    deserialize(data: SerializedData): void;
}