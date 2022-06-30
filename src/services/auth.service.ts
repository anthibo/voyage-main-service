import { getConnection, getRepository, Repository } from 'typeorm';
import { sign } from 'jsonwebtoken'
import { User, UserRole } from '../entity/user.entity';
import { SignToken } from '../utils/helpers/auth';
import { Agency } from '../entity/agency.entity';
import { OperationalError } from '../utils/helpers/error'
import { BusinessUserInput, ChangeUserPasswordDTO, LoginInput, NormalUserInput } from '../utils/interfaces/auth.interface';

export default class AuthService {
  private userRepository: Repository<User>;
  private agencyRepository: Repository<Agency>
  constructor() {
    this.userRepository = getRepository(User);
    this.agencyRepository = getRepository(Agency)
  }

  public async createNormalUser(input: NormalUserInput) {
    const existingUser = await this.userRepository.findOne({ where: [{ email: input.email }, { username: input.username }, { phoneNumber: input.phoneNumber }] })
    if (existingUser) {
      throw new OperationalError('email or username or phone exists')
    }
    const newNormalUser = this.userRepository.create(input)
    const user = await this.userRepository.save(newNormalUser);
    const { id, username, securityRole } = user
    const token = SignToken({ id, username, securityRole })
    return {
      statusCode: 201,
      data: {
        user,
        token
      }
    }
  }
  public async createAgency(input: BusinessUserInput) {
    const newAgency = this.agencyRepository.create(input)
    const agency = await this.agencyRepository.save(newAgency);
    const { id, username, companyName, nationalId } = agency
    const token = SignToken({ id, username, companyName, nationalId })
    return {
      agency,
      token
    }
  }
  public async createAdminUser(input: NormalUserInput) {
    const existingUser = await this.userRepository.findOne({ where: [{ email: input.email }, { username: input.username }, { phoneNumber: input.phoneNumber }] })
    if (existingUser) {
      throw new OperationalError('email or username or phone exists', 400)
    }
    const newAdmin = this.userRepository.create({ ...input, securityRole: UserRole.ADMIN })
    const admin = await this.userRepository.save(newAdmin);
    const { id, username, securityRole } = admin
    const token = SignToken({ id, username, securityRole })
    return {
      data: {
        admin,
        token
      }
    }

  }
  public async loginNormalUser(input: LoginInput) {
    const existingUser = await this.userRepository.findOne({ where: { securityRole: UserRole.USER, email: input.email } || { securityRole: UserRole.USER, email: input.email } })
    if (!existingUser) {
      throw new OperationalError('provided credentials do not match', 400)
    }
    const isValidPassword = await existingUser.comparePassword(input.password)
    if (!isValidPassword) throw new OperationalError('provided credentials do not match', 400)
    const token = SignToken({ id: existingUser.id, username: existingUser.username, securityRole: existingUser.securityRole })
    return {
      message: 'success',
      token: `Bearer ${token}`
    }
  }
  public async loginAdmin(input: LoginInput) {
    const existingUser = await this.userRepository.findOne({ where: { securityRole: UserRole.ADMIN, email: input.email } || { securityRole: UserRole.ADMIN, email: input.email } })
    if (!existingUser) {
      throw new OperationalError('provided credentials do not match', 400)
    }
    const isValidPassword = await existingUser.comparePassword(input.password)
    if (!isValidPassword) throw new OperationalError('provided credentials do not match', 400)
    const token = SignToken({ id: existingUser.id, username: existingUser.username, securityRole: existingUser.securityRole })
    return {
      message: 'success',
      token: `Bearer ${token}`
    }
  }
  public async loginAgency(input: LoginInput) {
    const existingUser = await this.agencyRepository.findOne({ where: [{ email: input.email }, { username: input.username }] })
    if (!existingUser) {
      throw new OperationalError('provided credentials do not match', 400)
    }
    const isValidPassword = await existingUser.comparePassword(input.password)
    if (!isValidPassword) throw new OperationalError('provided credentials do not match', 400)
    const token = SignToken({ id: existingUser.id, username: existingUser.username })
    return {
      message: 'success',
      token: `Bearer ${token}`
    }
  }

  async changeUserPassword(userId: string,input: ChangeUserPasswordDTO){
    const user = await this.userRepository.findOne(userId)
    if(!user) throw new OperationalError('User not found', 400)
    user['password'] = input.newPassword
    const newUser = await this.userRepository.save(user)
    return {message: 'user password is updated successfully'};

  }
}
