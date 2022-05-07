import {Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate} from "typeorm";
import * as bcrypt from 'bcryptjs';
import { CommonEntity } from "./commonEntity";

export enum UserRole {
    ADMIN = "admin",
    USER = "normal_user",
  }
  export enum UserStatus {
    ACTIVE = 'active',
    INACTIVE = "inactive",
    BANNED = 'banned'
  }
@Entity('users')
export class User extends CommonEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        length: 55
    })
    firstName!: string;

    @Column({
        length: 55
    })
    lastName!: string;

    @Column({
        length: 55,
        unique: true
    })
    username!: string

    @Column()
    private password!: string

    @Column({
        unique: true
    })
    email!: string

    @Column({
        unique: true,
        nullable: true
    })
    phoneNumber?: string

    @Column({
        type: "enum",
        enum: UserStatus,
        default: UserStatus.ACTIVE
    })
    status: string

    @Column(
        {
            type: "enum",
            enum: UserRole,
            default: UserRole.USER
        }
    )
    securityRole?: UserRole


    @BeforeInsert()
    @BeforeUpdate()
    private async hashPassword() {
      const salt = await bcrypt.genSalt()
      this.password = await bcrypt.hash(this.password, salt);
    }

    async comparePassword(password: string): Promise<boolean>{
        return await bcrypt.compare(password, this.password)
    }
}
