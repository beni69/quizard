export default class Pagination {
    constructor(public readonly pageSize: number) {}

    public async safeQuery<T>(call: T[] | Promise<T[]>, page: number) {
        const response = await call;
        const pageCount = Math.ceil(response.length / this.pageSize);
        if(page < 0 || page >= pageCount) page = 0;
        return {
            currentPage: page,
            matchCount: response.length,
            pageCount: Math.max(pageCount, 1),
            matchedRecords: response.slice(page * this.pageSize, (page + 1) * this.pageSize)
        }
    }
}