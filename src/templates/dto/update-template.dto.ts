import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateTemplateDto {
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  name?: string;
}
