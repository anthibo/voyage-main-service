import { Point } from "geojson"
import { CityPhoto } from "../../entity/city-photos.entity"

export interface CityInput {
    name: string
    description: string
    weatherAPI?: string
    rating?: number
    location: Point
    photos?: CityPhoto[] 
    
}   