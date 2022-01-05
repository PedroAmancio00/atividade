/* eslint-disable @typescript-eslint/no-explicit-any */
import { Expose } from 'class-transformer';

export class PaginatedResults {
  @Expose()
  rows: any;

  @Expose()
  page: number;

  @Expose()
  pageSize: number;

  @Expose()
  count: number;

  @Expose()
  pageCount?: number;

  @Expose()
  pageNumberIsGood?: boolean;

  @Expose()
  hasPreviousPage?: boolean;

  @Expose()
  hasNextPage?: boolean;

  @Expose()
  isFirstPage?: boolean;

  @Expose()
  isLastPage?: boolean;

  @Expose()
  numberOfFirstItemOnPage?: number;

  @Expose()
  firstItemOnPage?: number;

  @Expose()
  numberOfLastItemOnPage?: number;

  @Expose()
  lastItemOnPage?: number;

  constructor(data: any, count: number, page: number, pageSize: number) {
    this.rows = data;
    this.count = count;
    this.page = page;
    this.pageSize = pageSize;

    this.pageCount = this.count > 0 ? Math.ceil(parseFloat(`${this.count}`) / parseFloat(`${pageSize}`)) : 0;
    this.pageNumberIsGood = this.pageCount > 0 && page - 1 <= this.pageCount - 1 && page - 1 >= 0;
    this.hasPreviousPage = this.pageNumberIsGood && page - 1 > 0;
    this.hasNextPage = this.pageNumberIsGood && page < this.pageCount;
    this.isFirstPage = this.pageNumberIsGood && page - 1 === 0;
    this.isLastPage = this.pageNumberIsGood && page === this.pageCount;
    this.numberOfFirstItemOnPage = this.pageNumberIsGood ? (page - 1) * pageSize : 0;
    this.firstItemOnPage = this.pageNumberIsGood ? this.numberOfFirstItemOnPage : 0;
    this.numberOfLastItemOnPage = this.pageNumberIsGood ? this.numberOfFirstItemOnPage + this.rows.length - 1 : 0;
    this.lastItemOnPage = this.pageNumberIsGood ? this.count - 1 : 0;
  }
}
