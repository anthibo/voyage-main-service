import { Factory, Seeder } from "typeorm-seeding"
import { Connection, getRepository, Repository } from "typeorm";
import { User } from "../../entity/user.entity";
import { Place } from "../../entity/place.entity";
import PlaceRatingService from "../../services/place-rating.service";


export class PlaceRatingSeeder implements Seeder {
    private userRepository: Repository<User>;
    private placeRepository: Repository<Place>;
    private placeRatingService: PlaceRatingService;
    constructor() {
        this.userRepository = getRepository(User);
        this.placeRepository = getRepository(Place);
        this.placeRatingService = new PlaceRatingService();
    }
    public async run(factory: Factory): Promise<any> {
        // create 100 users
        await factory(User)().createMany(100);
        // get these users from the database
        const users = await this.userRepository.find({firstName: 'TestUser'});
        const places = await this.placeRepository.find({select: ['id']});
        // make each user rates 10 random places with random ratings between 1 and 5
        for (const user of users) {
            for (let i = 0; i < 10; i++) {
                const place = places[Math.floor(Math.random() * places.length)];
                await this.placeRatingService.addRating({userId: user.id, destinationId: place.id, rating: Math.floor(Math.random() * 5) + 1});
            }
        }
            
        
    }
    async truncate() {
    }
}