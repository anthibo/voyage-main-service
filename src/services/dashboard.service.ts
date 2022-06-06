import { getConnection, getRepository, Repository } from 'typeorm';
import { sign } from 'jsonwebtoken'
import { User } from '../entity/user.entity';
import { SignToken } from '../utils/helpers/auth';
import { Agency } from '../entity/agency.entity';
import { OperationalError } from '../utils/helpers/error'
import { BusinessUserInput, LoginInput, NormalUserInput } from '../utils/interfaces/auth.interface';
import { Place } from '../entity/place.entity';
import { City } from '../entity/city.entity';

export default class DashboardService {
    private userRepository: Repository<User>;
    private placeRepository: Repository<Place>
    private cityRepository: Repository<City>
    constructor() {
        this.userRepository = getRepository(User);
        this.placeRepository = getRepository(Place)
        this.cityRepository = getRepository(City)
    }

    async getPlaceCityUsersStats() {
        const usersCount = await this.userRepository.count()
        const placesCount = await this.placeRepository.count()
        const citiesCount = await this.cityRepository.count()


        return { usersCount, placesCount, citiesCount }
    }

}
