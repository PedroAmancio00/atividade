import { Controller, Delete, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IDeleteProduct } from '../contracts/delete-product';

import { DeleteProduct } from '../use-cases/delete-product';

@Controller('products')
export class DeleteProductController {
  constructor(private deleteProduct: DeleteProduct) {}

  @UseGuards(AuthGuard())
  @Delete('/delete-product/:id')
  async handleUpdateProduct(@Param('id') id: string): IDeleteProduct.Response {
    return this.deleteProduct.execute(id);
  }
}
