import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { KafkaModule } from '../kafka/kafka.module';
import { JobsCrdMapper } from './mappers/jobs-crd.mapper';

@Module({
  imports: [KafkaModule],
  controllers: [JobsController],
  providers: [JobsService, JobsCrdMapper]
})
export class JobsModule {}
