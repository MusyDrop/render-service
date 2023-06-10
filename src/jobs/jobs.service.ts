import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from './entities/job.entity';
import { DeepPartial, Repository } from 'typeorm';
import { TemplatesService } from '../templates/templates.service';
import { NotFoundError } from 'rxjs';
import { KafkaService } from '../kafka/kafka.service';
import { AnyObject } from '../utils/utility-types';
import { RenderJobPayload } from './interfaces/render-job-payload.interface';
import { JobStatus } from './enums/job-status.enum';

@Injectable()
export class JobsService {
  private readonly renderJobsTopicName = 'AERendererJobs';

  constructor(
    @InjectRepository(Job) private readonly jobsRepository: Repository<Job>,
    private readonly templatesService: TemplatesService,
    private readonly kafkaService: KafkaService
  ) {}

  public async create(props: DeepPartial<Job>): Promise<Job> {
    const template = await this.templatesService.findOne({
      id: props.id,
      name: props.template?.name,
      guid: props.template?.guid
    });

    return await this.jobsRepository.save({
      template: { id: template.id },
      audioFileName: props.audioFileName,
      settings: props.settings,
      userGuid: props.userGuid,
      projectGuid: props.projectGuid
    });
  }

  public async findOneNullable(props: DeepPartial<Job>): Promise<Job | null> {
    return await this.jobsRepository.findOneBy({
      id: props.id,
      guid: props.guid,
      status: props.status,
      template: { id: props.template?.id },
      audioFileName: props.audioFileName,
      settings: props.settings,
      userGuid: props.userGuid,
      projectGuid: props.projectGuid
    });
  }

  public async findOne(props: DeepPartial<Job>): Promise<Job> {
    const job = await this.findOneNullable(props);

    if (!job) {
      throw new NotFoundError('Job not found');
    }

    return job;
  }

  public async findAllWithTemplate(props: DeepPartial<Job>): Promise<Job[]> {
    return await this.jobsRepository.find({
      relations: {
        template: true
      },
      where: {
        id: props.id,
        guid: props.guid,
        template: { id: props.template?.id, guid: props.template?.guid },
        audioFileName: props.audioFileName,
        settings: props.settings,
        userGuid: props.userGuid,
        projectGuid: props.projectGuid
      }
    });
  }

  /**
   * Only status has to be updatable
   * @param props
   */
  public async updateById(props: DeepPartial<Job>): Promise<void> {
    await this.jobsRepository.update(
      {
        id: props.id
      },
      {
        status: props.status,
        projectGuid: props.projectGuid,
        userGuid: props.userGuid
      }
    );
  }

  public async findOneWithTemplateNullable(
    props: DeepPartial<Job>
  ): Promise<Job | null> {
    return this.jobsRepository.findOne({
      relations: {
        template: true
      },
      where: {
        id: props.id,
        guid: props.guid,
        template: { id: props.template?.id, guid: props.template?.guid },
        audioFileName: props.audioFileName,
        settings: props.settings,
        userGuid: props.userGuid,
        projectGuid: props.projectGuid
      }
    });
  }

  public async findOneWithTemplate(props: DeepPartial<Job>): Promise<Job> {
    const withTemplate = await this.findOneWithTemplateNullable(props);

    if (!withTemplate) {
      throw new NotFoundError('Job was not found');
    }

    return withTemplate;
  }

  public async render(
    guid: string,
    userGuid: string,
    settings: AnyObject
  ): Promise<Job> {
    const job = await this.findOneWithTemplate({ guid, userGuid });
    await this.updateById({
      id: job.id,
      settings,
      status: JobStatus.SUBMITTED
    });

    await this.kafkaService.emit<RenderJobPayload>(this.renderJobsTopicName, {
      jobGuid: job.guid,
      settings: job.settings,
      archiveFileName: job.template.archiveFileName,
      audioFileName: job.audioFileName
    });

    return await this.findOne({ id: job.id });
  }
}
