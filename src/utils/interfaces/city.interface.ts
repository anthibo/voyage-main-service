import { Point } from "geojson"
import { CityPhotos } from "../../entity/city-photos.entity"

export interface CityInput {
    name: string
    description: string
    weatherAPI?: string
    rating?: number
    location: Point
    photos?: CityPhotos[] 
    
}   