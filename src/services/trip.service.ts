import { getConnection, getRepository, Repository } from 'typeorm';
import { User } from '../entity/user.entity';

import { OperationalError } from '../utils/helpers/error'
import { Trip, TripType } from '../entity/trip.entity';
import { City } from '../entity/city.entity';

import { CustomizedTripDTO, CreateGeneratedTripDTO, SaveGeneratedTripAgendaDTO } from '../utils/interfaces/trip.dto';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import { Place } from '../entity/place.entity';
import { TripPlace } from '../entity/trip-place.entity';
import { not, number } from 'joi';
import { faker } from '@faker-js/faker';
import { Agenda } from '../entity/agenda.entity';
import { AgendaPlace } from '../entity/agenda-place.entity';
export default class TripService {
    private userRepository: Repository<User>;
    private tripRepository: Repository<Trip>;
    private cityRepository: Repository<City>;
    private placeRepository: Repository<Place>;
    private tripPlacesRepository: Repository<TripPlace>;
    private agendaRepository: Repository<Agenda>;
    private agendaPlaceRepository: Repository<AgendaPlace>;


    constructor() {
        this.userRepository = getRepository(User);
        this.cityRepository = getRepository(City);
        this.tripRepository = getRepository(Trip);
        this.placeRepository = getRepository(Place);
        this.tripPlacesRepository = getRepository(TripPlace);
        this.agendaRepository = getRepository(Agenda);
        this.agendaPlaceRepository = getRepository(AgendaPlace);
    }

    async createCustomizedTrip(input: CustomizedTripDTO, userId: string) {
        const trip = this.tripRepository.create({
            name: input.name,
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
        if (!trip) throw new OperationalError('Trip not found', 404);
        if (trip.user.id !== userId) {
            throw new OperationalError('You are not allowed to access this trip', 403);
        }
        delete trip.user
        const tripPlaces = await this.tripPlacesRepository.find({ where: { trip }, relations: ['place'] })
        trip.tripPlaces = tripPlaces;
        return { ...trip };
    }
    async listNotAddedPlaceTrips(userId: string, placeId: string) {
        // const trips =  await this.tripRepository.createQueryBuilder('trip')
        // .select('trip.id, trip.name')
        // .leftJoin('trip_places', 'trip_places', 'trip.id = trip_places.tripId')
        // .where('trip.userId = :userId', { userId })
        // .andWhere('trip_places.placeId = :placeId', { placeId })
        // .getMany()
        const place = await this.placeRepository.findOne(placeId);
        let trips = await this.tripRepository.find({ select: ['id', 'name'], relations: ['tripPlaces'], where: { user: { id: userId } } })
        console.log(trips[0].tripPlaces)
        // trips = trips.filter(trip => !trip.tripPlaces.find(tripPlace => tripPlace.place.id === placeId))
        return trips
    }
    async deleteTrip(userId: string, tripId: string) {
        const trip = await this.tripRepository.findOne(tripId, { relations: ['user'] });
        if (!trip) throw new OperationalError('Trip not found', 404);
        if (trip.user.id !== userId) {
            throw new OperationalError('You are not allowed to delete this trip', 403);
        }
        await this.tripPlacesRepository.delete({ trip });
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
        if (tripPlace) throw new OperationalError('Place already added to trip', 400);
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
        const { isChecked } = await this.tripPlacesRepository.save(tripPlace);
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
    async generateTrip(userId: string, input: CreateGeneratedTripDTO) {
        const { activities, cityId, name, numberOfDays } = input
        const city = await this.cityRepository.findOne(cityId)
        if (!city) throw new OperationalError('City not found', 404)
        const numberOfPlacesPerDay = 3
        const numberOfPlaces = numberOfDays * numberOfPlacesPerDay
        console.log(numberOfDays)
        const takenNoOfPlacesPerActivity = numberOfPlaces / activities.length
        let places = [] as Place[]
        const agenda = []
        const selectedPlacesIds = [] as string[]
        for (const activity of activities) {
            const activityPlaces = await this.placeRepository.find({ where: { city, activityType: activity }, order: { rating: 'DESC' }, take: takenNoOfPlacesPerActivity, select: ['id', 'name', 'photos', 'rating', 'activityType'] })
            places.push(...activityPlaces)
        }
        for (let i = 1; i <= numberOfDays; i++) {
            places = places.filter((place) => !selectedPlacesIds.some((id) => place.id === id));
            const dayPlaces = faker.helpers.arrayElements(places, numberOfPlacesPerDay)
            const dayPlacesIds = dayPlaces.map(place => place.id)
            selectedPlacesIds.push(...dayPlacesIds);
            const dayAgenda = { [`day${i}`]: dayPlaces }
            agenda.push(dayAgenda)
        }
        return {
            name: name,
            city: { name: city.name, id: cityId },
            agenda
        }
    }
    async saveGeneratedTrip(userId: string, generatedTripAgenda: SaveGeneratedTripAgendaDTO) {
        const user = await this.userRepository.findOne(userId);
        if (!user) {
            throw new OperationalError('User not found', 404);
        }
        const { cityId, name, agenda } = generatedTripAgenda;
        const city = await this.cityRepository.findOne(cityId)
        if (!city) throw new OperationalError('City not found', 404)
        const generatedTrip = this.tripRepository.create({
            name,
            city,
            type: TripType.GENERATED,
            user,
            id: uuidv4()
        })
        const savedGeneratedTrip = await this.tripRepository.save(generatedTrip)
        console.log(savedGeneratedTrip)
        let day = 1;
        for(const dayAgendaPlaces of agenda){
            const dayKey = Object.keys(dayAgendaPlaces)[0]
            const savedAgenda = await this.agendaRepository.save({
                trip: savedGeneratedTrip,
                day,
                id: uuidv4()
            })

            for(let place of dayAgendaPlaces[dayKey]){
                place = await this.placeRepository.findOne(place.id)
                await this.agendaPlaceRepository.save({
                    agenda:savedAgenda,
                    place
                })
            }
            day++;
        }
        return this.tripRepository.findOne(savedGeneratedTrip.id)
    }
    async listGeneratedTrips(userId: string){
        const user = await this.userRepository.findOne(userId);
        if (!user) {
            throw new OperationalError('User not found', 404);
        }
        return await this.tripRepository.find({type: TripType.GENERATED, user})
    }
}
