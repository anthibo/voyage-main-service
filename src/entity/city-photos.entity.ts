import {Entity, PrimaryGeneratedColumn, Column, ManyToOne} from "typeorm";
import { City } from "./city.entity";
import { PhotoEntity } from "./photoEntity";

@Entity('city_photos')
export class CityPhoto extends PhotoEntity {

    @ManyToOne(() => City, city => city.photos)
    city!: City 
}
