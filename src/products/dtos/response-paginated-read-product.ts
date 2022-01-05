import { PaginatedResults } from '../../common/dtos/paginated-results.dto';
import { ResponseReadProductsDto } from './response-read-products';

export class ResponsePaginatedReadProductsDto extends PaginatedResults {
  rows: ResponseReadProductsDto[];
}
