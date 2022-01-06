import { Body, Controller, Post, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../../auth/get-user.decorator';
import { UserEntity } from '../../users/entities/user.entity';
import { ICreateProduct } from '../contracts/create-product';
import { CreateProductDto } from '../dtos/create-product';
import { ResponseReadProductsDto } from '../dtos/response-read-products';
import { CreateProduct } from '../use-cases/create-product';

@Controller('products')
export class CreateProductController {
  constructor(private createProduct: CreateProduct) {}

  @UseGuards(AuthGuard())
  @Post('/create-product')
  async handleCreateProduct(
    @Body(ValidationPipe) createProductDto: CreateProductDto,
    @GetUser() user: UserEntity,
  ): Promise<ResponseReadProductsDto> {
    const product = this.createProduct.execute({
      createProductDto,
      user,
    });
    return ResponseReadProductsDto.factory(ResponseReadProductsDto, product);
  }
}
