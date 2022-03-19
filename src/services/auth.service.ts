import { getConnection, getRepository, Repository } from 'typeorm';
import {sign} from 'jsonwebtoken'
import {User} from '../entity/user.entity';
import { SignToken } from '../utils/helpers/auth';
import { Agency } from '../entity/agency.entity';
import AppError from '../errors/error'
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
interface LoginInput{
  email: string;
  username: string;
  password: string
}
 export default class AuthService {
    private userRepository: Repository<User>;
    private agencyRepository: Repository<Agency>
    constructor() {
        this.userRepository = getRepository(User);
        this.agencyRepository = getRepository(Agency)
      }

      public async createNormalUser(input:NormalUserInput)
      {
        try{
          const existingUser = await this.userRepository.findOne({where:[{email: input.email}, {username: input.username}]})
          if(existingUser){
            throw new Error('email or pw exists')
          }
          const newNormalUser = this.userRepository.create(input)
          const user =  await this.userRepository.save(newNormalUser);
          const {id, username, securityRole} = user
          const token = SignToken({id, username, securityRole})
          return {
            statusCode:201,
            data:{
              user,
              token
            }
          }
        }
        catch(err){
          console.log(err)
          throw new Error(err)
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
          //TODO: to be implemented
    }
    // implement app error
    public async loginNormalUser(input: LoginInput){
        console.log(input)
        const existingUser = await this.userRepository.findOne({where:[{email: input.email}, {username: input.username}]})
        if(!existingUser){
          throw new AppError('provided credentials do not match', 400)
        }
        const isValidPassword = await existingUser.comparePassword(input.password)
        if(!isValidPassword) throw new AppError('provided credentials do not match', 400)
        const token = SignToken({id: existingUser.id, username: existingUser.username, securityRole: existingUser.securityRole})
        return {
          message: 'success',
          token: `Bearer ${token}`
        }
      
      
    }
    public async loginAgency(input: LoginInput){
        const existingUser = await this.agencyRepository.findOne({where:[{email: input.email}, {username: input.username}]})
        if(!existingUser){
          throw new AppError('provided credentials do not match', 400)
        }
        const isValidPassword = await existingUser.comparePassword(input.password)
        if(!isValidPassword) throw new AppError('provided credentials do not match', 400)
        const token = SignToken({id: existingUser.id, username: existingUser.username})
        return {
          message: 'success',
          token: `Bearer ${token}`  
        } 
    }
}
