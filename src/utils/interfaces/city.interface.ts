import { Point } from "geojson"

export interface CityInput {
    name: string
    description: string
    weatherAPI?: string
    rating?: number
    location: Point
    photos?: string[]
}   