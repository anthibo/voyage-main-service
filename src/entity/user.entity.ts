import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

export enum UserRole {
    ADMIN = "admin",
    USER = "normal_user",
    BUSINESS_USER = "business_user"
  }
  export enum UserStatus {
    ACTIVE = 'active',
    INACTIVE = "inactive"
  }
@Entity('user')
export class User {
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

    @Column({
        unique: true
    })
    email!: string

    @Column({
        unique: true
    })
    phoneNumber!: string

    @Column({
        unique: true,
    })
    nationalId: string

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
    securityRole: UserRole

}
