import { getConnection, getRepository, Repository } from 'typeorm';
import { User } from '../entity/user.entity';

import { OperationalError } from '../utils/helpers/error'
import { Trip, TripType } from '../entity/trip.entity';
import { City } from '../entity/city.entity';
import { CustomizedTripDTO } from '../utils/interfaces/trip.dto';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import { Place } from '../entity/place.entity';
import { TripPlace } from '../entity/trip-place.entity';
import { not } from 'joi';

export default class TripService {
    private userRepository: Repository<User>;
    private tripRepository: Repository<Trip>;
    private cityRepository: Repository<City>;
    private placeRepository: Repository<Place>;
    private tripPlacesRepository: Repository<TripPlace>;
    constructor() {
        this.userRepository = getRepository(User);
        this.cityRepository = getRepository(City);
        this.tripRepository = getRepository(Trip);
        this.placeRepository = getRepository(Place);
        this.tripPlacesRepository = getRepository(TripPlace);
    }

    async createCustomizedTrip(input: CustomizedTripDTO, userId: string) {
        const trip = this.tripRepository.create({
            name: input.name,
            startDate: input.startDate,
            endDate: input.endDate,
            type: TripType.CUSTOMIZED,
            city: await this.cityRepository.findOne(input.cityId),
            user: await this.userRepository.findOne(userId),
            id: uuidv4()
        })
        console.log(trip)
        await this.tripRepository.save(trip);
        return `created trip successfully`;
    }
    async updateCustomizedTrip(userId: string, tripId: string, input: CustomizedTripDTO) {
        const trip = await this.tripRepository.findOne(tripId, { relations: ['user'] });
        if (!trip) throw new OperationalError('Trip not found', 404);
        if (trip.user.id !== userId) {
            throw new OperationalError('You are not allowed to update this trip', 403);
        }
        trip.name = input.name;
        trip.startDate = input.startDate;
        trip.endDate = input.endDate;
        trip.city = await this.cityRepository.findOne(input.cityId);
        await this.tripRepository.save(trip);
        return 'Trip updated';
    }
    async findAllUserTrips(userId: string) {
        const user = await this.userRepository.findOne(userId);
        if (!user) {
            throw new OperationalError('User not found', 404);
        }
        return this.tripRepository.find({ user });
    }
    async getTrip(userId: string, tripId: string) {
        const trip = await this.tripRepository.findOne(tripId, { relations: ['user'] });
        if(!trip) throw new OperationalError('Trip not found', 404);
        if (trip.user.id !== userId) {
            throw new OperationalError('You are not allowed to access this trip', 403);
        }
        delete trip.user
        const tripPlaces = await this.tripPlacesRepository.find({where: {trip}, relations: ['place']})
        trip.tripPlaces = tripPlaces;
        return { ...trip, startDate: moment(trip.startDate).format('DD-MM-YYYY'), endDate: moment(trip.endDate).format('DD-MM-YYYY') };
    }
    async listNotAddedPlaceTrips(userId: string, placeId: string) {
        // const trips =  await this.tripRepository.createQueryBuilder('trip')
        // .select('trip.id, trip.name')
        // .leftJoin('trip_places', 'trip_places', 'trip.id = trip_places.tripId')
        // .where('trip.userId = :userId', { userId })
        // .andWhere('trip_places.placeId = :placeId', { placeId })
        // .getMany()
        const place = await this.placeRepository.findOne(placeId);
        const trips = await this.tripRepository.find({select: ['id', 'name'], relations: ['tripPlaces'], where: {user: {id: userId}}})
        
        console.log(trips)
        return trips
    }
    async deleteTrip(userId: string, tripId: string) {
        const trip = await this.tripRepository.findOne(tripId, { relations: ['user'] });
        if (!trip) throw new OperationalError('Trip not found', 404);
        if (trip.user.id !== userId) {
            throw new OperationalError('You are not allowed to delete this trip', 403);
        }
        await this.tripPlacesRepository.delete({trip});
        await this.tripRepository.delete({ id: tripId });
        return 'Trip deleted';
    }
    async addPlaceToTrip(userId: string, tripId: string, placeId: string) {
        const trip = await this.tripRepository.findOne(tripId, { relations: ['user', 'tripPlaces'] });
        console.log(trip)
        if (!trip) throw new OperationalError('Trip not found', 404);
        if (trip.user.id !== userId) {
            throw new OperationalError('You are not allowed to add place to this trip', 403);
        }
        const place = await this.placeRepository.findOne(placeId);
        if (!place) throw new OperationalError('Place not found', 404);
        let tripPlace = await this.tripPlacesRepository.findOne({ trip, place });
        if(tripPlace) throw new OperationalError('Place already added to trip', 400);
        tripPlace = this.tripPlacesRepository.create({ place, trip });
        await this.tripPlacesRepository.save(tripPlace);
        return 'Place added to trip';
    }
    async togglePlaceCheckInTrip(userId: string, tripId: string, placeId: string) {
        const trip = await this.tripRepository.findOne(tripId, { relations: ['user'] });
        if (!trip) throw new OperationalError('Trip not found', 404);
        if (trip.user.id !== userId) {
            throw new OperationalError('You are not allowed to toggle place check in this trip', 403);
        }
        const place = await this.placeRepository.findOne(placeId, { relations: ['tripPlaces'] });
        if (!place) throw new OperationalError('Place not found', 404);
        const tripPlace = await this.tripPlacesRepository.findOne({ trip, place });
        if (!tripPlace) throw new OperationalError('Place not found in trip', 404);
        tripPlace.isChecked = !tripPlace.isChecked;
       const {isChecked} =  await this.tripPlacesRepository.save(tripPlace);
        return isChecked;
    }
    async deletePlaceFromTrip(userId: string, tripId: string, placeId: string) {
        const trip = await this.tripRepository.findOne(tripId, { relations: ['user'] });
        if (!trip) throw new OperationalError('Trip not found', 404);
        if (trip.user.id !== userId) {
            throw new OperationalError('You are not allowed to delete place from this trip', 403);
        }
        const place = await this.placeRepository.findOne(placeId);
        if (!place) throw new OperationalError('Place not found', 404);
        const tripPlace = await this.tripPlacesRepository.findOne({ trip, place });
        if (!tripPlace) throw new OperationalError('Place not found in trip', 404);
        await this.tripPlacesRepository.remove(tripPlace);
        return 'Place deleted from trip';
    }
}
