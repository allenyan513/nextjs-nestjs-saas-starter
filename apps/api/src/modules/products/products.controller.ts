import {
  Controller,
  Get,
  Logger,
  Req,
  UseGuards,
  Param,
  Delete,
} from '@nestjs/common';
import { ProductsService } from '@src/modules/products/products.service';

@Controller('products')
export class ProductsController {
  private readonly logger = new Logger(ProductsController.name);

  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async findAll() {
    return await this.productsService.findAll(slug);
  }
}
