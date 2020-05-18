import { SearchResult } from './search-result';

export interface SearchResults {
    results: SearchResult[];
    query: string;
    count: number;
    totalCount: number;
    page: number;
    totalPages: number;
}
