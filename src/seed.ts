import User from './module/auth/auth.model'
import Ticket from './module/ticket/ticket.model'
import Comment from './module/comment/comment.model'
import connect from './db/connects'
import faker from 'faker';

const checkAdmin = User.find({ email: 'superadmin@gmail.com' })
if (!checkAdmin) {
    const superadmin = User.create({
        name: 'superadmin',
        email: 'superadmin@gmail.com',
        role: 'admin',
        password: 'password'
    })
}
//superadmin
const customer = User.create({
    name: faker.name.findName(),
    email: faker.internet.email(),
    role: 'customer',
    password: 'password'
})
const agent = User.create({
    name: faker.name.findName(),
    email: faker.internet.email(),
    role: 'customer',
    password: 'password'
})

const admin = User.create({
    name: faker.name.findName(),
    email: faker.internet.email(),
    role: 'customer',
    password: 'password'
})


