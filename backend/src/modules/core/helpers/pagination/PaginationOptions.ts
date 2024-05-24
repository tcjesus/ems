export class PaginationOptions {
  page: number
  limit: number
  offset: number

  constructor (page: number, limit: number) {
    this.page = page
    this.limit = limit
    this.offset = (page * limit) - limit
  }
}
