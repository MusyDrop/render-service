import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  FileTypeValidator
} from '@nestjs/common';
import { TemplatesService } from './templates.service';
import { CreateTemplateDto } from './dto/create-template.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileRequiredPipe } from '../common/pipes/file-required.pipe';
import { CreateTemplateResponseDto } from './dto/response/create-template-response.dto';
import { TemplatesCrdMapper } from './dto/mappers/templates-crd.mapper';

@Controller('/templates')
export class TemplatesController {
  constructor(
    private readonly templatesService: TemplatesService,
    private readonly responseMapper: TemplatesCrdMapper
  ) {}

  @UseInterceptors(FileInterceptor('archive'))
  @Post('/')
  public async create(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileRequiredPipe({}),
          new FileTypeValidator({
            fileType: 'application/zip'
          })
        ]
      })
    )
    archive: Express.Multer.File, // TODO: Add streaming instead of keeping buffer in memory
    @Body() dto: CreateTemplateDto
  ): Promise<CreateTemplateResponseDto> {
    const template = await this.templatesService.create(archive.buffer, dto);
    return this.responseMapper.createMapper(template);
  }
}
