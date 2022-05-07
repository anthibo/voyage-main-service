import { getRepository, Repository, TypeORMError } from "typeorm";
import { City } from "../entity/city.entity";
import { TransportationMeans } from '../entity/transportation-means.entity';
import { TransportationCityFees } from '../entity/transportation-city-fees.entity';
import {OperationalError} from "../utils/helpers/error";
import { TransportationCityFeesInput } from "../utils/interfaces/transportation.interface";



export default class TransportationService {
    private cityRepository: Repository<City>;
    private transportationMeanRepository: Repository<TransportationMeans>;
    private transportationCityFeesRepository: Repository<TransportationCityFees>;
    constructor() {
        this.cityRepository = getRepository(City)
        this.transportationMeanRepository = getRepository(TransportationMeans)
        this.transportationCityFeesRepository = getRepository(TransportationCityFees)

    }

    async findAllTransportationMeans(): Promise<Array<TransportationMeans>> {
            return await this.transportationMeanRepository.find()
    }

    async findOneTransportationMean(id: string): Promise<TransportationMeans> {
        const transportationMean = await this.transportationMeanRepository.findOne(id)
        if (!transportationMean) throw new OperationalError('transportation is not found', 400)
        return transportationMean
    }

    async createTransportationMean(transportationType: string): Promise<TransportationMeans> {
        const existingTransportationType = await this.transportationMeanRepository.findOne({ where: { transportationType } })
        if (existingTransportationType) throw new OperationalError('this name already exists', 400)
        const transportationMean = this.transportationMeanRepository.create({ transportationType })
        return await this.transportationMeanRepository.save(transportationMean)
    }

    async updateTransportationMean(id: string,transportationType: string): Promise<TransportationMeans> {
        const existingTransportationType = await this.transportationMeanRepository.findOne(id)
        if (!existingTransportationType) throw new OperationalError('there is no transportationMean of id '+id, 400)
        const transportationMean = await this.transportationMeanRepository.save({ ...existingTransportationType,transportationType })
        return transportationMean 
    }
    async deleteTransportationMean(id: string) {
        const existingTransportationType = await this.transportationMeanRepository.findOne(id)
        if (!existingTransportationType) throw new OperationalError('there is not transportation mean of id ' + id, 400)
        await this.transportationMeanRepository.delete({ id })
    }

    async createCityTransportationFees(input: TransportationCityFeesInput){
        const {cityId, transportationMeanId, kmCost} = input
        const transportationMean = await this.transportationMeanRepository.findOne(transportationMeanId)
        if(!transportationMean) throw new OperationalError(`transportationMean of id ${transportationMeanId} does not exist`)
        const city = await this.cityRepository.findOne(cityId)
        if(!city) throw new OperationalError(`city of id ${transportationMeanId} does not exist`)
        const transportationCityFees = this.transportationCityFeesRepository.create({
            city,
            transportationMean,
            kmCost
        })
        return await this.transportationCityFeesRepository.save(transportationCityFees)
    }

    async findAllTransportationCityFees(): Promise<Array<TransportationCityFees>> {
        return await this.transportationCityFeesRepository.find({relations: ['city', 'transportationMean']})
    }
    

}