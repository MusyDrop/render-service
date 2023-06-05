import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Generated,
  UpdateDateColumn
} from 'typeorm';
import { PrimaryGeneratedColumn } from 'typeorm';
import { TemplateDto } from '../dto/template.dto';

@Entity('templates')
export class Template {
  @PrimaryGeneratedColumn()
  id: number;

  @Generated('uuid')
  @Column()
  guid: string;

  @Column({ unique: true })
  name: string;

  @Column()
  archiveFileName: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;

  public static toDto(template?: Template): TemplateDto | null {
    if (!template) return null;
    return {
      guid: template.guid,
      name: template.name,
      archiveFileName: template.archiveFileName
    };
  }
}
