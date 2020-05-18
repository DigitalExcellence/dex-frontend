import { User } from "./user";

export interface SearchResult {
    id: number;
    user: User;
    name: string;
    shortDescription: string;
    created: Date;
    updated: Date;
}
