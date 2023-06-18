import { Injectable } from '@nestjs/common';
import { ResponseDtoMapper } from '../../common/types';
import { JobsController } from '../jobs.controller';
import { Job } from '../entities/job.entity';
import { GetAllJobsResponseDto } from '../dtos/response/get-all-jobs-response.dto';
import { JobDto } from '../dtos/job.dto';
import { RenderJobResponseDto } from '../dtos/response/render-job-response.dto';

@Injectable()
export class JobsCrdMapper implements ResponseDtoMapper<JobsController> {
  public findAllMapper(jobs: Job[]): GetAllJobsResponseDto {
    return {
      jobs: jobs.map((j) => Job.toDto(j)) as JobDto[]
    };
  }

  public renderMapper(job: Job): RenderJobResponseDto {
    return {
      job: Job.toDto(job) as JobDto
    };
  }
}
