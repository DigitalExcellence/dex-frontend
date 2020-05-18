export interface InternalSearchQuery {
    query: string;
    page?: number;
    amountOnPage?: number;
    sortBy?: string;
    sortDirection?: string;
    highlighted?: boolean
}
