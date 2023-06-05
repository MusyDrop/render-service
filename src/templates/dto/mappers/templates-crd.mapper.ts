import { Injectable } from '@nestjs/common';
import { ResponseDtoMapper } from '../../../common/types';
import { TemplatesController } from '../../templates.controller';
import { CreateTemplateResponseDto } from '../response/create-template-response.dto';
import { Template } from '../../entities/template.entity';
import { TemplateDto } from '../template.dto';

@Injectable()
export class TemplatesCrdMapper
  implements ResponseDtoMapper<TemplatesController>
{
  public createMapper(template: Template): CreateTemplateResponseDto {
    return {
      template: Template.toDto(template) as TemplateDto
    };
  }
}
