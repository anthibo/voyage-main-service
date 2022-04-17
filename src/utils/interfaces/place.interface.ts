import { Point } from "geojson"
import { PlacePhoto } from "../../entity/place-photos.entity"

export interface PlaceInput {
    name: string
    cityId: string
    description: string
    rating?: number
    location: Point
    photos?: PlacePhoto[]
    phoneNumber?: string
    website?: string
    activityType: string
    price: number

    
}   
