import { Controller, Delete, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { GetUser } from '../../auth/get-user.decorator';
import { UserEntity } from '../../users/entities/user.entity';
import { IDeleteProduct } from '../contracts/delete-product';

import { DeleteProduct } from '../use-cases/delete-product';

@Controller('products')
export class DeleteProductController {
  constructor(private deleteProduct: DeleteProduct) {}

  @ApiTags('Products')
  @ApiOkResponse()
  @UseGuards(AuthGuard())
  @Delete('/delete-product/:id')
  async handleUpdateProduct(@Param('id') id: string, @GetUser() user: UserEntity): IDeleteProduct.Response {
    return this.deleteProduct.execute({ id, user });
  }
}
