import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from './entities/job.entity';
import { DeepPartial, Repository } from 'typeorm';
import { TemplatesService } from '../templates/templates.service';
import { NotFoundError } from 'rxjs';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job) private readonly jobsRepository: Repository<Job>,
    private readonly templatesService: TemplatesService
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
      settings: props.settings
    });
  }

  public async findOneNullable(props: DeepPartial<Job>): Promise<Job | null> {
    return await this.jobsRepository.findOneBy({
      id: props.id,
      guid: props.guid,
      status: props.status,
      template: { id: props.id },
      audioFileName: props.audioFileName,
      settings: props.settings
    });
  }

  public async findOne(props: DeepPartial<Job>): Promise<Job> {
    const job = await this.findOneNullable(props);

    if (!job) {
      throw new NotFoundError('Job not found');
    }

    return job;
  }

  public async findAll(props: DeepPartial<Job>): Promise<Job[]> {
    return await this.jobsRepository.findBy({
      id: props.id,
      guid: props.guid,
      template: { id: props.id, guid: props.guid },
      audioFileName: props.audioFileName,
      settings: props.settings
    });
  }

  /**
   * Only status has to be updatable
   * @param props
   */
  public async update(props: DeepPartial<Job>): Promise<void> {
    await this.jobsRepository.update(
      {
        id: props.id,
        guid: props.guid,
        template: { id: props.id }
      },
      {
        status: props.status
      }
    );
  }
}
