
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

  @Column({ type: 'varchar', nullable: true })
  resetCode: string | null;


  @Column({ type: 'timestamp', nullable: true })
  resetTokenExpiration: Date | null;

  @Column({ default: false })
  isPasswordChanged: boolean;


  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;



}
