import { Factory, Seeder } from "typeorm-seeding"
import { readCsv } from "../csvs";
import * as path from 'path'
import { Place } from "../../entity/place.entity";
import { getRepository, Repository } from "typeorm";

export class PlaceSeeder implements Seeder {
    private placeRepository: Repository<Place>;
    constructor() {
        this.placeRepository = getRepository(Place);
    }
  public async run(factory: Factory): Promise<void> {
    const placesData = readCsv(path.join(__dirname, '../csvs/Places.csv'));
        for (const place of placesData) {
            const existingPlace = await this.placeRepository.findOne({ where: { name: place.name.toLowerCase() } });
            if (!existingPlace) {
                const newPlace = new Place();
                newPlace.name = place.name;
                newPlace.description = 'place description to be edited later';
                newPlace.location = {
                    type: "Point",
                    coordinates: [parseFloat(place.latitude), parseFloat(place.longitude)]
                }
                newPlace.photos = []
                newPlace.activityType = place.activity
                newPlace.price = parseInt(place.price);
                await this.placeRepository.save(newPlace);
            }
        }
    }
    async truncate() {
        await this.placeRepository.delete({});
    }
}