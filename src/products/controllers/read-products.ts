import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { QueryProductDto } from '../dtos/query-product';
import { ResponsePaginatedReadProductsDto } from '../dtos/response-paginated-read-product';
import { ResponseReadProductsDto } from '../dtos/response-read-products';
import { ReadProduct } from '../use-cases/read-product';

@Controller('products')
export class ReadProductController {
  constructor(private readProduct: ReadProduct) {}

  @UseGuards(AuthGuard())
  @Get('/read-product')
  async handleReadProduct(@Query() queryProductDto: QueryProductDto): Promise<ResponsePaginatedReadProductsDto> {
    const { page, limit } = queryProductDto;
    const [products, count] = await this.readProduct.execute({
      ...queryProductDto,
    });
    const parsedProducts = ResponseReadProductsDto.factory(ResponseReadProductsDto, products);
    return new ResponsePaginatedReadProductsDto(parsedProducts, count, page, limit);
  }
}
