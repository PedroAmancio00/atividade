import { Body, Controller, Param, Patch, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { GetUser } from '../../auth/get-user.decorator';
import { UserEntity } from '../../users/entities/user.entity';
import { ResponseReadProductsDto } from '../dtos/response-read-products';

import { UpdateProductDto } from '../dtos/update-product';
import { UpdateProduct } from '../use-cases/update-product';

@Controller('products')
export class UpdateProductController {
  constructor(private updateProduct: UpdateProduct) {}

  @ApiTags('Products')
  @ApiOkResponse({ type: ResponseReadProductsDto })
  @ApiBody({ type: UpdateProductDto })
  @UseGuards(AuthGuard())
  @Patch('/update-product/:id')
  async handleUpdateProduct(
    @Param('id') id: string,
    @Body(ValidationPipe) updateProductDto: UpdateProductDto,
    @GetUser() user: UserEntity,
  ): Promise<ResponseReadProductsDto> {
    const product = this.updateProduct.execute({ updateProductDto, id, user });
    return ResponseReadProductsDto.factory(ResponseReadProductsDto, product);
  }
}
