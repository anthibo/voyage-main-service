import { Point } from "geojson"
export interface PlaceInput {
    name: string
    cityId: string
    description: string
    rating?: number
    location: Point
    photos?: string[]
    phoneNumber?: string
    website?: string
    activityType: string
    price: number

    
}   
