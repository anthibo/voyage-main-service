import {Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate, Index,} from "typeorm";

export abstract class PhotoEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        unique: true,
    })
    path!: string;

}
