import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { KafkaModule } from '../kafka/kafka.module';

@Module({
  controllers: [JobsController],
  providers: [JobsService]
})
export class JobsModule {}
