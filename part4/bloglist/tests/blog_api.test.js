const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')


const api = supertest(app)
const creatorUsername = 'user1'
const noncreatorUsername = 'user2'


beforeEach(async () => {
    await User.deleteMany({})
    const userObjects = helper.initialUsers
        .map(user => new User(user))
    const promiseArrayUsers = userObjects.map(user => user.save())
    await Promise.all(promiseArrayUsers)
    const user = await User.findOne({ username: creatorUsername })

    await Blog.deleteMany({})
    const blogObjects = helper.initialBlogs
        .map(blog => new Blog({  user:user._id, ...blog }))
    const promiseArrayBlogs = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArrayBlogs)
})

afterAll(() => {
    mongoose.connection.close()
})
describe('when there is initially some blogs saved', () => {
    test('blogs are returned as json and have valid length', async () => {
        const response = await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
        expect(response.body).toHaveLength(helper.initialBlogs.length)
        response.body.forEach(blog => expect(blog.id).toBeDefined())
    })
})

describe('addition of a new blog', () => {
    test('a valid blog can be added ', async () => {
        const newBlog = {
            title: 'New Blog',
            author: 'Robert C. Martin',
            url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
            likes: 5
        }

        await api
            .post('/api/blogs')
            .set('Authorization', `bearer ${await helper.createToken(creatorUsername)}`)
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd.length).toBe(helper.initialBlogs.length + 1)

        // eslint-disable-next-line no-unused-vars
        expect(blogsAtEnd.map(({ id, user, ...rest }) => rest)).toContainEqual(newBlog)
    })

    test('a blog without likes field can be added ', async () => {
        const newBlog = {
            title: 'New Blog',
            author: 'Robert C. Martin',
            url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
        }

        await api
            .post('/api/blogs')
            .set('Authorization', `bearer ${await helper.createToken(creatorUsername)}`)
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd.length).toBe(helper.initialBlogs.length + 1)

        newBlog.likes = 0
        // eslint-disable-next-line no-unused-vars
        expect(blogsAtEnd.map(({ id, user, ...rest }) => rest)).toContainEqual(newBlog)
    })

    test('a blog without title and url is not added', async () => {
        const newBlog = {
            author: 'Robert C. Martin',
            likes: 5
        }

        await api
            .post('/api/blogs')
            .set('Authorization', `bearer ${await helper.createToken(creatorUsername)}`)
            .send(newBlog)
            .expect(400)

        const blogsAtEnd = await helper.blogsInDb()

        expect(blogsAtEnd.length).toBe(helper.initialBlogs.length)
    })

    test('blog cannot if no token is provided', async () => {
        const newBlog = {
            title: 'New Blog',
            author: 'Robert C. Martin',
            url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
            likes: 5
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(401)

        const blogsAtEnd = await helper.blogsInDb()

        expect(blogsAtEnd.length).toBe(helper.initialBlogs.length)
    })
})

describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid and user is a creator', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToDelete = blogsAtStart[0]

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .set('Authorization', `bearer ${await helper.createToken(creatorUsername)}`)
            .expect(204)

        const blogsAtEnd = await helper.blogsInDb()

        expect(blogsAtEnd.length).toBe(
            helper.initialBlogs.length - 1
        )
        expect(blogsAtEnd).not.toContainEqual(blogToDelete)
    })
    test('fails with status code 401 if id is valid and user is not a creator', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToDelete = blogsAtStart[0]

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .set('Authorization', `bearer ${await helper.createToken(noncreatorUsername)}`)
            .expect(401)

        const blogsAtEnd = await helper.blogsInDb()

        expect(blogsAtEnd.length).toBe(
            helper.initialBlogs.length
        )
        expect(blogsAtEnd).toContainEqual(blogToDelete)
    })
})

describe('updating of a blog', () => {
    test('succeeds with status code 200 if id is valid', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToUpdate= blogsAtStart[0]
        const newBlog = {
            likes: blogToUpdate.likes + 10
        }

        await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .send(newBlog)
            .expect(200)

        const blogsAtEnd = await helper.blogsInDb()

        expect(blogsAtEnd.length).toBe(
            helper.initialBlogs.length
        )
        blogToUpdate.likes = newBlog.likes
        expect(blogsAtEnd).toContainEqual(blogToUpdate)
    })
})