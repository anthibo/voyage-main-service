import {faker} from '@faker-js/faker';
import { getRepository } from 'typeorm';
import { define } from 'typeorm-seeding';
import { User } from '../../entity/user.entity';

type Faker = typeof faker
define(User, (faker: Faker) => {
    const firstName = 'TestUser'
    const lastName = faker.name.lastName()
    const email = faker.internet.email()
    const username = faker.internet.userName()
    const password = faker.internet.password()
    const user = new User()
    user.firstName = firstName
    user.lastName = lastName
    user.email = email
    user.username = username
    user.password = password

    return user
})