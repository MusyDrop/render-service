import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException
} from '@nestjs/common';
import { CreateTemplateDto } from './dto/create-template.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Template } from './entities/template.entity';
import { DeepPartial, Repository } from 'typeorm';
import { S3Service } from '../s3/s3.service';
import { ExtendedConfigService } from '../config/extended-config.service';

@Injectable()
export class TemplatesService {
  constructor(
    @InjectRepository(Template)
    private readonly templatesRepository: Repository<Template>,
    private readonly s3Service: S3Service,
    private readonly config: ExtendedConfigService
  ) {}

  public async findOneNullable(
    props: DeepPartial<Template>
  ): Promise<Template | null> {
    return await this.templatesRepository.findOneBy({
      id: props.id,
      guid: props.guid,
      name: props.name,
      userGuid: props.userGuid,
      archiveFileName: props.archiveFileName
    });
  }

  public async findOne(props: DeepPartial<Template>): Promise<Template> {
    const template = await this.findOneNullable(props);

    if (!template) {
      throw new NotFoundException('Template not found');
    }

    return template;
  }

  public async create(
    userGuid: string,
    archive: Buffer,
    dto: CreateTemplateDto
  ): Promise<Template> {
    const archiveFileName = await this.s3Service.putObject(
      this.config.get('minio.buckets.templatesBucket'),
      archive
    );

    const template = await this.templatesRepository.save({
      name: dto.name,
      archiveFileName,
      userGuid
    });

    return template;
  }

  public async findAll(props: DeepPartial<Template>): Promise<Template[]> {
    return await this.templatesRepository.findBy({
      id: props.id,
      guid: props.guid,
      name: props.name,
      userGuid: props.userGuid,
      archiveFileName: props.archiveFileName
    });
  }

  public async update(
    userGuid: string,
    guid: string,
    props: DeepPartial<Template>,
    archive?: Buffer
  ): Promise<Template> {
    const template = await this.findOne({ guid, userGuid });

    let archiveFileName;
    if (archive) {
      archiveFileName = await this.s3Service.putObject(
        this.config.get('minio.buckets.templatesBucket'),
        archive
      );
    }

    await this.templatesRepository.update(
      { guid, userGuid },
      {
        name: props.name,
        archiveFileName: archiveFileName
      }
    );

    return await this.findOne({ id: template.id });
  }
}
