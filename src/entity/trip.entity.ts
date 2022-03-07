import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class trip {

    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column()
    name: string
}
