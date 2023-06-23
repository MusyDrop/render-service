import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards
} from '@nestjs/common';
import { JobsService } from './jobs.service';
import { RenderJobDto } from './dtos/render-job.dto';
import { RenderJobResponseDto } from './dtos/response/render-job-response.dto';
import { JobsCrdMapper } from './mappers/jobs-crd.mapper';
import { GetAllJobsResponseDto } from './dtos/response/get-all-jobs-response.dto';
import { AuthGuard } from '../auth/auth.guard';
import { Request } from 'express';
import { FindJobsQueryDto } from './dtos/find-jobs-query.dto';

@Controller('/jobs')
export class JobsController {
  constructor(
    private readonly jobsService: JobsService,
    private readonly responseMapper: JobsCrdMapper
  ) {}

  @UseGuards(AuthGuard)
  @Get('/')
  public async findAll(
    @Req() req: Request,
    @Query() queryDto: FindJobsQueryDto
  ): Promise<GetAllJobsResponseDto> {
    const jobs = await this.jobsService.findAllWithTemplate({
      userGuid: req.user.guid,
      projectGuid: queryDto.projectGuid
    });
    return this.responseMapper.findAllMapper(jobs);
  }

  @UseGuards(AuthGuard)
  @Post('/render')
  public async render(
    @Req() req: Request,
    @Body() dto: RenderJobDto
  ): Promise<RenderJobResponseDto> {
    const job = await this.jobsService.render(req.user.guid, dto);
    return this.responseMapper.renderMapper(job);
  }
}
