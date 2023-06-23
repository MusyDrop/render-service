import { IsUUID } from 'class-validator';

export class FindJobsQueryDto {
  @IsUUID()
  projectGuid: string;
}
