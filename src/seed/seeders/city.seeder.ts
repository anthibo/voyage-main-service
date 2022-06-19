import { Factory, Seeder } from "typeorm-seeding"
import { City } from "../../entity/city.entity"
import { readCsv } from "../csvs"
import * as path from 'path';
import { getRepository, Repository } from "typeorm";


export class CitySeeder implements Seeder {
    private cityRepository: Repository<City>;
    constructor() {
        this.cityRepository = getRepository(City);
    }
    public async run(factory: Factory): Promise<void> {
        const citesData = readCsv(path.join(__dirname, '../csvs/Cities.csv'));
        for (const city of citesData) {
            const existingCity = await this.cityRepository.findOne({ where: { name: city.name.toLowerCase() } });
            if (!existingCity) {
                const newCity = new City();
                newCity.name = city.name;
                newCity.description = 'city description to be edited later';
                newCity.location = {
                    type: "Point",
                    coordinates: [parseFloat(city.latitude), parseFloat(city.longitude)]
                }
                newCity.photos = [city.photo]
                await this.cityRepository.save(newCity);
            }
        }
    }
    async truncate() {
        await this.cityRepository.delete({});
    }
}