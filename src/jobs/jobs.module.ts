import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { KafkaModule } from '../kafka/kafka.module';
import { JobsCrdMapper } from './mappers/jobs-crd.mapper';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from './entities/job.entity';
import { TemplatesModule } from '../templates/templates.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    KafkaModule,
    TypeOrmModule.forFeature([Job]),
    TemplatesModule,
    AuthModule
  ],
  controllers: [JobsController],
  providers: [JobsService, JobsCrdMapper]
})
export class JobsModule {}
