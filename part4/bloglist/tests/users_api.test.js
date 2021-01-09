const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')
const helper = require('./test_helper')

const api = supertest(app)


beforeEach(async () => {
    await User.deleteMany({})

    const userObjects = helper.initialUsers
        .map(user => new User(user))
    const promiseArray = userObjects.map(user => user.save())
    await Promise.all(promiseArray)
})

afterAll(() => {
    mongoose.connection.close()
})
describe('when there is initially some users saved', () => {
    test('users are returned as json and have valid length', async () => {
        const response = await api
            .get('/api/users')
            .expect(200)
            .expect('Content-Type', /application\/json/)
        expect(response.body).toHaveLength(helper.initialUsers.length)
        response.body.forEach(user => expect(user.id).toBeDefined())
    })
})

describe('addition of a new user', () => {
    test('a valid user can be added ', async () => {
        const newUser = {
            username: 'new_user',
            name: 'New User',
            password: '12341234'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd.length).toBe(helper.initialUsers.length + 1)

        expect(usersAtEnd.map(({ username, name }) => {return { username, name }})).toContainEqual({
            username: newUser.username,
            name: newUser.name
        })
    })

    test('a user without username is not added', async () => {
        const newUser = {
            name: 'New User',
            password: '12341234'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)

        const usersAtEnd = await helper.usersInDb()

        expect(usersAtEnd.length).toBe(helper.initialUsers.length)
    })
    test('a user without password is not added', async () => {
        const newUser = {
            username: 'new_user',
            name: 'New User',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)

        const usersAtEnd = await helper.usersInDb()

        expect(usersAtEnd.length).toBe(helper.initialUsers.length)
    })
    test('a user with username shorter than 3 characetrs is not added', async () => {
        const newUser = {
            username: 'ne',
            name: 'New User',
            password: '12341234'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)

        const usersAtEnd = await helper.usersInDb()

        expect(usersAtEnd.length).toBe(helper.initialUsers.length)
    })
    test('a user with password shorter than 3 characetrs is not added', async () => {
        const newUser = {
            username: 'new_user',
            name: 'New User',
            password: '12'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)

        const usersAtEnd = await helper.usersInDb()

        expect(usersAtEnd.length).toBe(helper.initialUsers.length)
    })
    test('a user with non-unique username is not added', async () => {
        const newUser = {
            username: 'user1',
            name: 'New User',
            password: '12341234'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)

        const usersAtEnd = await helper.usersInDb()

        expect(usersAtEnd.length).toBe(helper.initialUsers.length)
    })
})
