import { Factory, Seeder } from "typeorm-seeding"
import { readCsv } from "../csvs";
import * as path from 'path'
import { Place } from "../../entity/place.entity";
import { getRepository, Repository } from "typeorm";
import { City } from "../../entity/city.entity";
import { faker } from "@faker-js/faker";

export class PlaceSeeder implements Seeder {
    private placeRepository: Repository<Place>;
    private cityRepository: Repository<City>;
    constructor() {
        this.placeRepository = getRepository(Place);
        this.cityRepository = getRepository(City);
    }
  public async run(factory: Factory): Promise<void> {
    const placesData = readCsv(path.join(__dirname, '../csvs/Places.csv'));
        for (const place of placesData) {
            const existingPlace = await this.placeRepository.findOne({ where: { name: place.name.toLowerCase().trim() } });
            if (!existingPlace) {
                const newPlace = new Place();
                newPlace.name = place.name.trim();
                newPlace.description = faker.lorem.paragraph();
                newPlace.location = {
                    type: "Point",
                    coordinates: [parseFloat(place.latitude), parseFloat(place.longitude)]
                }
                newPlace.photos = []
                newPlace.activityType = place.activity.trim()
                newPlace.price = parseInt(place.price);
                newPlace.city = await this.cityRepository.findOne({where: {name: place.city.toLowerCase().trim()}})
                await this.placeRepository.save(newPlace);
            }
        }
    }
    async truncate() {
        await this.placeRepository.delete({});
    }
}