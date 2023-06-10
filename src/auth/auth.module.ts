import { Module } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { MainServiceModule } from '../main-service/main-service.module';

@Module({
  imports: [MainServiceModule],
  providers: [AuthGuard]
})
export class AuthModule {}
