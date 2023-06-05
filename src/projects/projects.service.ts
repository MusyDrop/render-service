import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException
} from '@nestjs/common';
import { DeepPartial, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dtos/create-project.dto';
import { generateUniqueId } from '../utils/unique-id-generator';
import { S3Service } from '../s3/s3.service';
import { ExtendedConfigService } from '../config/extended-config.service';
import { AudiosService } from './audios.service';
import { AnalyzerApiClient } from '../audio-meta/analyzer.api-client';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectsRepository: Repository<Project>,
    private readonly s3Service: S3Service,
    private readonly config: ExtendedConfigService,
    private readonly audiosService: AudiosService,
    private readonly analyzerApiClient: AnalyzerApiClient
  ) {}

  public async create(
    userId: number,
    props: CreateProjectDto
  ): Promise<Project> {
    const existingProject = await this.findOneNullable({
      user: { id: userId },
      name: props.name
    });

    if (existingProject) {
      throw new UnprocessableEntityException(
        'Project with such already exists'
      );
    }

    return await this.projectsRepository.save({
      name: props.name,
      templateId: props.templateId,
      user: { id: userId }
    });
  }

  public async findOneNullable(
    props: DeepPartial<Project>
  ): Promise<Project | null> {
    return await this.projectsRepository.findOneBy({
      id: props.id,
      guid: props.guid,
      name: props.name,
      templateId: props.templateId
    });
  }

  public async findOne(props: DeepPartial<Project>): Promise<Project> {
    const project = await this.findOneNullable(props);

    if (!project) {
      throw new NotFoundException('Project has not been found');
    }

    return project;
  }

  public async findAllByUserId(userId: number): Promise<Project[]> {
    return await this.projectsRepository.findBy({
      user: { id: userId }
    });
  }

  public async updateByUserId(
    userId: number,
    props: DeepPartial<Project>
  ): Promise<Project> {
    return await this.projectsRepository.save({
      ...props,
      user: { id: userId }
    });
  }

  public async update(props: DeepPartial<Project>): Promise<Project> {
    return await this.projectsRepository.save({
      id: props.id,
      guid: props.guid,
      name: props.name,
      templateId: props.templateId,
      audio: props.audio,
      user: props.user
    });
  }

  /**
   * @returns generated audio file name
   * @param guid
   * @param audioFile
   */
  public async uploadAudioFile(
    guid: string,
    audioFile: Buffer
  ): Promise<string> {
    const audioFileName = await this.s3Service.putObject(
      this.config.get('minio.buckets.audioFilesBucket'),
      audioFile
    );

    const project = await this.findOne({ guid });

    const metadata = await this.analyzerApiClient.getAudioMetadata(
      audioFileName
    );

    const audio = await this.audiosService.create({
      audioFileName,
      durationSecs: metadata.durationSecs,
      bitsPerSample: metadata.bitsPerSample,
      numberOfChannels: metadata.numberOfSamples,
      bitrate: metadata.bitrate,
      lossless: metadata.lossless,
      numberOfSamples: metadata.numberOfSamples,
      codec: metadata.codec,
      container: metadata.container,
      compressedRms: metadata.compressedRms
    });

    await this.update({
      id: project.id,
      audio: { id: audio.id }
    });

    return audioFileName;
  }
}
