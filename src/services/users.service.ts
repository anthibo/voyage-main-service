import { getConnection, getRepository, Repository } from 'typeorm';
import {sign} from 'jsonwebtoken'
import {User} from '../entity/user.entity';
import { SignToken } from '../utils/helpers/auth';
import { Agency } from '../entity/agency.entity';
import {OperationalError} from '../utils/helpers/error'
import { BusinessUserInput, LoginInput, NormalUserInput } from '../utils/interfaces/auth.interface';

 export default class UserService {
    private userRepository: Repository<User>;
    private agencyRepository: Repository<Agency>
    constructor() {
        this.userRepository = getRepository(User);
        this.agencyRepository = getRepository(Agency)
      }

    async findNormalUserById(id: string){
        const user = await this.userRepository.findOne(id)
        if (!user) throw new OperationalError('this user does not exist', 400)
        return user
    }
}
