import {Entity, PrimaryGeneratedColumn, Column, BeforeInsert} from "typeorm";
import * as bcrypt from 'bcryptjs';
import { CommonEntity } from "./commonEntity";

export enum UserStatus {
    ACTIVE = 'active',
    INACTIVE = "inactive",
    BANNED = 'banned'
  }
@Entity('agencies')
export class Agency extends CommonEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        length: 55
    })
    companyName!: string;

    @Column({
        length: 55,
        unique: true
    })
    username!: string

    @Column()
    password!: string

    @Column({
        unique: true
    })
    email!: string

    @Column({
        unique: true
    })
    nationalId!: string

    @Column({
        unique: true,
        nullable:true
    })
    fbLink?: string

    @Column({
        unique: true,
        nullable:true
    })
    igLink?: string
    @Column({
        unique: true
    })
    phoneNumber!: string

    @Column({
        nullable: true
    })
    address?: string
    
    @Column({
        type: "enum",
        enum: UserStatus,
        default: UserStatus.ACTIVE
    })
    status: string

    @BeforeInsert()
    async beforeInsert() {
      const salt = await bcrypt.genSalt()
      this.password = await bcrypt.hash(this.password, salt);
    }
}
