import { Body, Controller, Patch, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { UpdateProductDto } from '../dtos/update-product';
import { UpdateProduct } from '../use-cases/update-product';

@Controller('products')
export class UpdateProductController {
  constructor(private updateProduct: UpdateProduct) {}

  @UseGuards(AuthGuard())
  @Patch('/update-product')
  async handleUpdateProduct(@Body(ValidationPipe) updateProductDto: UpdateProductDto): Promise<{ message: string }> {
    return this.updateProduct.execute({
      ...updateProductDto,
    });
  }
}
