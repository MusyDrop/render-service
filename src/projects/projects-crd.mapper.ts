import { ProjectsController } from './projects.controller';
import { ResponseDtoMapper } from '../common/types';
import { CreateProjectResponseDto } from './dtos/response/create-project-response.dto';
import { GetProjectResponseDto } from './dtos/response/get-project-response.dto';
import { GetProjectsResponseDto } from './dtos/response/get-projects-response.dto';
import { Injectable } from '@nestjs/common';
import { Project } from './entities/project.entity';
import { UpdateProjectResponseDto } from './dtos/response/update-project-response.dto';
import { UploadAudioFileResponseDto } from './dtos/response/upload-audio-file-response.dto';
import { ProjectDto } from './dtos/project.dto';

// NOTE: CRD - ControllerResponseDto
@Injectable()
export class ProjectsCrdMapper
  implements ResponseDtoMapper<ProjectsController>
{
  public createMapper(project: Project): CreateProjectResponseDto {
    return {
      project: Project.toDto(project) as ProjectDto
    };
  }

  public findAllMapper(projects: Project[]): GetProjectsResponseDto {
    return {
      projects: projects.map((p) => Project.toDto(p) as ProjectDto)
    };
  }

  public findOneMapper(project: Project): GetProjectResponseDto {
    return {
      project: Project.toDto(project) as ProjectDto
    };
  }

  public updateMapper(project: Project): UpdateProjectResponseDto {
    return {
      project: Project.toDto(project) as ProjectDto
    };
  }

  public uploadAudioMapper(audioFileName: string): UploadAudioFileResponseDto {
    return {
      fileName: audioFileName
    };
  }
}
