import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  FileTypeValidator,
  Get,
  UseGuards,
  Req,
  Param,
  Put,
  Patch
} from '@nestjs/common';
import { TemplatesService } from './templates.service';
import { CreateTemplateDto } from './dto/create-template.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileRequiredPipe } from '../common/pipes/file-required.pipe';
import { CreateTemplateResponseDto } from './dto/response/create-template-response.dto';
import { TemplatesCrdMapper } from './mappers/templates-crd.mapper';
import { GetAllTemplatesResponseDto } from './dto/response/get-all-templates-response.dto';
import { AuthGuard } from '../auth/auth.guard';
import { Request } from 'express';
import { GetOneTemplateResponseDto } from './dto/response/get-one-template-response.dto';
import { ValidateUuidPipe } from '../common/pipes/validate-uuid.pipe';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TemplateDto } from './dto/template.dto';
import { UpdateTemplateResponseDto } from './dto/response/update-template-response.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';

@Controller('/templates')
export class TemplatesController {
  constructor(
    private readonly templatesService: TemplatesService,
    private readonly responseMapper: TemplatesCrdMapper
  ) {}

  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('archive'))
  @Post('/')
  public async create(
    @Req() req: Request,
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
    const template = await this.templatesService.create(
      req.user.guid,
      archive.buffer,
      dto
    );
    return this.responseMapper.createMapper(template);
  }

  @UseGuards(AuthGuard)
  @Get('/')
  public async findAll(
    @Req() req: Request
  ): Promise<GetAllTemplatesResponseDto> {
    const templates = await this.templatesService.findAll({
      userGuid: req.user.guid
    });
    return this.responseMapper.findAllMapper(templates);
  }

  @UseGuards(AuthGuard)
  @Get('/:guid')
  public async findOne(
    @Param('guid', new ValidateUuidPipe()) guid: string,
    @Req() req: Request
  ): Promise<GetOneTemplateResponseDto> {
    const template = await this.templatesService.findOne({ guid });
    return this.responseMapper.findOneMapper(template);
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('archive'))
  @Patch('/:guid')
  public async update(
    @Req() req: Request,
    @Param('guid', new ValidateUuidPipe()) guid: string,
    @Body() body: UpdateTemplateDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({
            fileType: 'application/zip'
          })
        ]
      })
    )
    archive: Express.Multer.File
  ): Promise<UpdateTemplateResponseDto> {
    const template = await this.templatesService.update(
      req.user.guid,
      guid,
      {
        name: body.name
      },
      archive.buffer
    );
    return this.responseMapper.updateMapper(template);
  }
}
