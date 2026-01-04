
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

@Entity('user')
export default class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, nullable: false })
  phoneNumber: string;

  @Column({ length: 25, nullable: true })
  firstName?: string;

  @Column({ length: 25, nullable: true })
  lastName?: string;

  @Column({ select: false, nullable: true })
  password: string;

  @Column({ nullable: true })
  resetCode?: string;

  @Column({ nullable: true, type: 'timestamp' })
  resetTokenExpiration?: Date;

  @Column({ default: false })
  isPasswordChanged: boolean;

  @Column({ select: false, nullable: true })
  twoFASecret: string;

  @Column({ default: false })
  isTwoFAEnabled: boolean;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;



}
