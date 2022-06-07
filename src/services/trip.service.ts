import { getConnection, getRepository, Repository } from 'typeorm';
import { User } from '../entity/user.entity';

import { OperationalError } from '../utils/helpers/error'
import { Trip, TripType } from '../entity/trip.entity';
import { City } from '../entity/city.entity';
import { CustomizedTripDTO } from '../utils/interfaces/trip.dto';

export default class TripService {
    private userRepository: Repository<User>;
    private tripRepository: Repository<Trip>;
    private cityRepository: Repository<City>;
    constructor() {
        this.userRepository = getRepository(User);
        this.cityRepository = getRepository(City);
        this.tripRepository = getRepository(Trip);
    }

    async createCustomizedTrip(input: CustomizedTripDTO, userId: string) {
        const trip = new Trip();
        trip.startDate = input.startDate;
        trip.endDate = input.endDate;
        trip.type = TripType.CUSTOMIZED;
        trip.city = await this.cityRepository.findOne(input.cityId);
        trip.user = await this.userRepository.findOne(userId);
        return await this.tripRepository.save(trip);
    }
    async findAllUserTrips(userId: string) {
        const user = await this.userRepository.findOne(userId);
        return this.tripRepository.find({user});
    }
}
