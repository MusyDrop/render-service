import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  Req,
  UseGuards
} from '@nestjs/common';
import { JobsService } from './jobs.service';
import { UpdateJobDto } from './dtos/update-job.dto';
import { SuccessResponseDto } from '../common/dtos/success-response.dto';
import { JobsSystemCrdMapper } from './mappers/JobsSystemCrdMapper';
import { AuthGuard } from '../auth/auth.guard';
import { Request } from 'express';
import { RenderJobDto } from './dtos/render-job.dto';
import { RenderJobResponseDto } from './dtos/response/render-job-response.dto';

@Controller('/system/jobs')
export class JobsSystemController {
  constructor(
    private readonly jobsService: JobsService,
    private readonly responseMapper: JobsSystemCrdMapper
  ) {}

  @Patch('/:guid')
  public async update(
    @Param('guid') guid: string,
    @Body() dto: UpdateJobDto
  ): Promise<SuccessResponseDto> {
    await this.jobsService.updateById({
      guid,
      status: dto.status,
      settings: dto.settings
    });
    return this.responseMapper.updateMapper();
  }
}
