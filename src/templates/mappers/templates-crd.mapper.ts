import { Injectable } from '@nestjs/common';
import { ResponseDtoMapper } from '../../common/types';
import { TemplatesController } from '../templates.controller';
import { CreateTemplateResponseDto } from '../dto/response/create-template-response.dto';
import { Template } from '../entities/template.entity';
import { TemplateDto } from '../dto/template.dto';
import { GetAllTemplatesResponseDto } from '../dto/response/get-all-templates-response.dto';
import { GetOneTemplateResponseDto } from '../dto/response/get-one-template-response.dto';
import { UpdateTemplateResponseDto } from '../dto/response/update-template-response.dto';

@Injectable()
export class TemplatesCrdMapper
  implements ResponseDtoMapper<TemplatesController>
{
  public createMapper(template: Template): CreateTemplateResponseDto {
    return {
      template: Template.toDto(template) as TemplateDto
    };
  }

  public findAllMapper(templates: Template[]): GetAllTemplatesResponseDto {
    return {
      templates: templates.map((t) => Template.toDto(t)) as TemplateDto[]
    };
  }

  public findOneMapper(template: Template): GetOneTemplateResponseDto {
    return {
      template: Template.toDto(template) as TemplateDto
    };
  }

  public updateMapper(template: Template): UpdateTemplateResponseDto {
    return {
      template: Template.toDto(template) as TemplateDto
    };
  }
}
