import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards
} from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dtos/create-job.dto';
import { CreateJobResponseDto } from './dtos/response/create-job-response.dto';
import { JobsCrdMapper } from './mappers/jobs-crd.mapper';
import { GetAllJobsResponseDto } from './dtos/response/get-all-jobs-response.dto';
import { RenderJobDto } from './dtos/render-job.dto';
import { RenderJobResponseDto } from './dtos/response/render-job-response.dto';
import { AuthGuard } from '../auth/auth.guard';
import { Request } from 'express';

@Controller('/jobs')
export class JobsController {
  constructor(
    private readonly jobsService: JobsService,
    private readonly responseMapper: JobsCrdMapper
  ) {}

  @UseGuards(AuthGuard)
  @Post('/me')
  public async create(
    @Req() req: Request,
    @Body() dto: CreateJobDto
  ): Promise<CreateJobResponseDto> {
    const job = await this.jobsService.create({
      template: { guid: dto.templateGuid },
      audioFileName: dto.audioFileName,
      settings: dto.settings,
      projectGuid: dto.projectGuid,
      userGuid: req.user.guid
    });
    return this.responseMapper.createMapper(job);
  }

  @UseGuards(AuthGuard)
  @Get('/me')
  public async findAll(@Req() req: Request): Promise<GetAllJobsResponseDto> {
    const jobs = await this.jobsService.findAllWithTemplate({
      userGuid: req.user.guid
    });
    return this.responseMapper.findAllMapper(jobs);
  }

  @UseGuards(AuthGuard)
  @Post('/:guid/render')
  public async render(
    @Req() req: Request,
    @Param('guid') guid: string,
    @Body() dto: RenderJobDto
  ): Promise<RenderJobResponseDto> {
    const job = await this.jobsService.render(
      guid,
      req.user.guid,
      dto.settings
    );
    return this.responseMapper.renderMapper(job);
  }
}
