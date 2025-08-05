import { Test, TestingModule } from '@nestjs/testing';
import { StrapiService } from './strapi.service';
import { describe, expect, it, beforeEach } from '@jest/globals';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';

describe('StrapiService', () => {
  let service: StrapiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env',
        }),
        PrismaModule, // Assuming PrismaModule is defined in your application
      ],
      providers: [StrapiService],
    }).compile();

    service = module.get<StrapiService>(StrapiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('find one by id', async () => {
    const result = await service.transformProductCategories();
    console.log(result);
  });
  it('transform products', async () => {
    const result = await service.transformProducts();
    console.log(result)
  });
});
