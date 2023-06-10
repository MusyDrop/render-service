import { Module } from '@nestjs/common';
import { TemplatesService } from './templates.service';
import { TemplatesController } from './templates.controller';
import { ConfigModule } from '../config/config.module';
import { S3Module } from '../s3/s3.module';
import { TemplatesCrdMapper } from './mappers/templates-crd.mapper';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Template } from './entities/template.entity';

@Module({
  imports: [ConfigModule, S3Module, TypeOrmModule.forFeature([Template])],
  controllers: [TemplatesController],
  providers: [TemplatesService, TemplatesCrdMapper],
  exports: [TemplatesService]
})
export class TemplatesModule {}
