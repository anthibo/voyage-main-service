import { getConnection, getRepository, Repository } from 'typeorm';
import { User } from '../entity/user.entity';

import { OperationalError } from '../utils/helpers/error'
import { Trip, TripType } from '../entity/trip.entity';
import { City } from '../entity/city.entity';
import { CustomizedTripDTO } from '../utils/interfaces/trip.dto';
import { Agenda } from '../entity/agenda.entity';
import {v4 as uuidv4} from 'uuid';
import moment from 'moment';

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
        // const trip = new Trip();
        // trip.startDate = input.startDate;
        // trip.endDate = input.endDate;
        // trip.type = TripType.CUSTOMIZED;
        // trip.city = await this.cityRepository.findOne(input.cityId);
        // trip.user = await this.userRepository.findOne(userId);
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
    async findAllUserTrips(userId: string) {
        const user = await this.userRepository.findOne(userId);
        if(!user){
            throw new OperationalError('User not found', 404);
        }
        return this.tripRepository.find({user});
    }
    async getTrip(userId: string, tripId:string){
        const trip = await this.tripRepository.findOne(tripId, {relations:['city','user', 'agendas']});
        if(trip.user.id !== userId){
            throw new OperationalError('You are not allowed to access this trip', 403);
        }
        return {...trip, startDate: moment(trip.startDate).format('DD-MM-YYYY'), endDate: moment(trip.endDate).format('DD-MM-YYYY')};
    }
    async deleteTrip(userId: string, tripId:string){
        const trip = await this.tripRepository.findOne(tripId);
        if(trip.user.id !== userId){
            throw new OperationalError('You are not allowed to access this trip', 403);
        }
        await this.tripRepository.remove(trip);
        return {message: 'Trip deleted'};
    }
    async createTripAgenda(userId: string, tripId:string){
        // TODO: create agenda first then assign the agendas to the trip
        const trip = await this.tripRepository.findOne(tripId);
        if(trip.user.id !== userId){
            throw new OperationalError('You are not allowed to access this trip', 403);
        }
        const agenda = new Agenda();
        agenda.trip = trip;
        return await this.tripRepository.save(agenda);

    }
}
