import { Global, Module } from '@nestjs/common';
import { StrapiService } from './strapi.service';

@Global()
@Module({
  providers: [StrapiService],
  exports: [StrapiService],
})
export class StrapiModule {}
