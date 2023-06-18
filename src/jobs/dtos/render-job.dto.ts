import {
  IsArray,
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsString,
  IsUUID
} from 'class-validator';
import { AnyObject } from '../../utils/utility-types';

export class RenderJobDto {
  @IsUUID()
  templateGuid: string;

  @IsUUID()
  projectGuid: string;

  // As specified on S3
  @IsString()
  @IsNotEmpty()
  audioFileName: string;

  @IsObject()
  @IsDefined()
  settings: AnyObject;

  @IsArray()
  @IsNumber({}, { each: true })
  compressedRms: number[];

  @IsNumber()
  audioDurationSecs: number;
}
