/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class PaginatedResults {
  @Expose()
  rows: any;

  @ApiProperty()
  @Expose()
  page: number;

  @ApiProperty()
  @Expose()
  pageSize: number;

  @ApiProperty()
  @Expose()
  count: number;

  @ApiProperty()
  @Expose()
  pageCount?: number;

  @ApiProperty()
  @Expose()
  pageNumberIsGood?: boolean;

  @ApiProperty()
  @Expose()
  hasPreviousPage?: boolean;

  @ApiProperty()
  @Expose()
  hasNextPage?: boolean;

  @ApiProperty()
  @Expose()
  isFirstPage?: boolean;

  @ApiProperty()
  @Expose()
  isLastPage?: boolean;

  @ApiProperty()
  @Expose()
  numberOfFirstItemOnPage?: number;

  @ApiProperty()
  @Expose()
  firstItemOnPage?: number;

  @ApiProperty()
  @Expose()
  numberOfLastItemOnPage?: number;

  @ApiProperty()
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
