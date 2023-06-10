import { AnyObject } from '../../utils/utility-types';
import { IsObject } from 'class-validator';

export class RenderJobDto {
  @IsObject()
  settings: AnyObject;
}
