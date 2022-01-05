import { Body, Controller, Post, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateProductDto } from '../dtos/create-product';
import { CreateProduct } from '../use-cases/create-product';

@Controller('products')
export class CreateProductController {
  constructor(private createProduct: CreateProduct) {}

  @UseGuards(AuthGuard())
  @Post('/create-product')
  async handleCreateProduct(@Body(ValidationPipe) createProductDto: CreateProductDto): Promise<{ message: string }> {
    return this.createProduct.execute({
      ...createProductDto,
    });
  }
}
