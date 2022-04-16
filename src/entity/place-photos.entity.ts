import {Entity, PrimaryGeneratedColumn, Column, ManyToOne} from "typeorm";
import { PhotoEntity } from "./photoEntity";
import { Place } from "./place.entity";

@Entity('place_photos')
export class PlacePhoto extends PhotoEntity {

    @ManyToOne(() => Place, place => place.photos)
    place!: Place 
}
