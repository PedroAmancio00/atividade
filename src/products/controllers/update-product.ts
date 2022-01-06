import { Body, Controller, Param, Patch, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ResponseReadProductsDto } from '../dtos/response-read-products';

import { UpdateProductDto } from '../dtos/update-product';
import { UpdateProduct } from '../use-cases/update-product';

@Controller('products')
export class UpdateProductController {
  constructor(private updateProduct: UpdateProduct) {}

  @UseGuards(AuthGuard())
  @Patch('/update-product/:id')
  async handleUpdateProduct(
    @Param('id') id: string,
    @Body(ValidationPipe) updateProductDto: UpdateProductDto,
  ): Promise<ResponseReadProductsDto> {
    const product = this.updateProduct.execute({ updateProductDto, id });
    return ResponseReadProductsDto.factory(ResponseReadProductsDto, product);
  }
}
