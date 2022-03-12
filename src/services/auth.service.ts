import { getConnection, getRepository, Repository } from 'typeorm';
import {sign} from 'jsonwebtoken'
import {User} from '../entity/user.entity';
import { SignToken } from '../utils/helpers/auth';
import { Agency } from '../entity/agency.entity';

interface BusinessUserInput {
  email : string;
  companyName: string;
  address?: string;
  username: string;
  password: string;
  phoneNumber: string
  fb_link?: string;
  ig_link?: string;
  nationalId:string;
}
interface NormalUserInput {
  email : string;
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  currentCity?: string;
  phoneNumber?: string
}
 export default class AuthService {
    private userRepository: Repository<User>;
    private agencyRepository: Repository<Agency>
    constructor() {
        this.userRepository = getRepository(User);
        this.agencyRepository = getRepository(Agency)
      }
      public async createNormalUser(input:NormalUserInput){
        const newNormalUser = this.userRepository.create(input)
        const user =  await this.userRepository.save(newNormalUser);
        const {id, username, securityRole} = user
        const token = SignToken({id, username, securityRole})
        return {
          user,
          token
        } 
      }
      public async createAgency(input: BusinessUserInput){
        const newAgency = this.agencyRepository.create(input)
        const agency =  await this.agencyRepository.save(newAgency);
        const {id, username, companyName, nationalId} = agency
        const token = SignToken({id, username, companyName, nationalId})
        return {
          agency,
          token
        } 
      }
      public async createAdminUser(){
          
    }
}
