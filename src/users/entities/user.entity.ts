import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Generated,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { Profile } from './profile.entity';
import { UserDto } from '../dto/user.dto';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @Generated('uuid')
  guid: string;

  @Column({ unique: true })
  email: string;

  /**
   * Nullable when authenticated via OAUTH
   */
  @Column({ nullable: true })
  password?: string;

  /**
   * Is authenticated by using google oauth identity provider
   */
  @Column({ default: false, name: 'is_oauth_enabled' })
  isOAuthEnabled: boolean;

  /**
   * Used for 2FA
   */
  @Column({ nullable: true, name: 'two_factor_auth_secret' })
  twoFactorAuthSecret?: string;

  @Column({ default: false, name: 'is_two_factor_auth_enabled' })
  isTwoFactorAuthEnabled: boolean;

  @OneToOne(() => Profile, (profile) => profile.user, { nullable: false })
  profile: Profile;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;

  public static toDto(user?: User): UserDto | null {
    if (!user) return null;

    return {
      guid: user.guid,
      email: user.email,
      isOAuthEnabled: user.isOAuthEnabled,
      isTwoFactorAuthEnabled: user.isTwoFactorAuthEnabled,
      profile: Profile.toDto(user.profile) as Profile
    };
  }
}
