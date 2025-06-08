const mongoose = require('mongoose')
const assert = require('assert')
const { test, after, beforeEach } = require('node:test')
const supertest = require('supertest')
const listHelper = require('../utils/list_helper')
const app = require('../app') 
const Blog = require('../models/blog') 
const api = supertest(app)
const User = require('../models/user')

const blogs = [
  {
    title: 'Testiblogi 1',
    author: 'Testi-elisa',
    url: 'http://example.com/blogi1',
    likes: 5
  },
  {
    title: 'Testiblogi 2',
    author: 'Testi-pertti',
    url: 'http://example.com/blogi2',
    likes: 2
  }
]

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(blogs)
  await User.deleteMany({})

  const user = new User({
    username: 'root',
    passwordHash: await require('bcrypt').hash('sekret', 10),
  })
  await user.save()
})


test('all blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('correct number of blogs is returned', async () => {
  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length, blogs.length)
})

test('blog with the most likes', () => {
    const result = listHelper.favoriteBlog(blogs)
    assert.deepStrictEqual(result, blogs[0])
  })

test('blog have an id', async () => {
  const response = await api.get('/api/blogs')
  const blogs = response.body

  for (const blog of blogs) {
    assert.ok(blog.id, 'id should be defined')
   }
})

  test('new blog can be added', async () => {
    const newBlog = {
      title: "Testi blogi",
      author: "Testi-liisa",
      url: "http://www.test.com",
      likes: 0,
    }
    await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201) 
    .expect('Content-Type', /application\/json/)

const response = await api.get('/api/blogs')
const titles = response.body.map(blog => blog.title)

assert.strictEqual(response.body.length, blogs.length + 1)
assert.ok(titles.includes("Testi blogi"))
})
 
test('if likes is missing its zero', async () => {
  const newBlog = {
    title: 'Blogi ilman likejä',
    author: 'Testaaja-liisa',
    url: 'http://example.com/no-likes'
  }

const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.likes, 0)
})

test('blog without title is not added', async () => {
  const newBlog = {
    author: 'Tekijä jonka blogilla ei ole nimeä',
    url: 'http://example.com/notitle',
    likes: 1
  }

await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
})

test('blog without url is not added', async () => {
  const newBlog = {
    title: 'Blogi ilman osoitetta',
    author: 'Tekijä jonka blogilla ei ole osoitetta',
    likes: 1
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
})

test('blog can be deleted', async () => {
    const newBlog = {
    title: 'Blogi joka poistetaan',
    author: 'Author',
    url: 'http://delete.blogi.fi',
    likes: 0,
  }
   const postResponse = await api.post('/api/blogs').send(newBlog)
   const blogToDelete = postResponse.body

   await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

  const response = await api.get('/api/blogs')
  const ids = response.body.map(b => b.id)

  assert.strictEqual(ids.includes(blogToDelete.id), false)
})

test('blog can be updated', async () => {
    const response = await api.get('/api/blogs')
    const blogToUpdate = response.body[0]

     const updatedData = {
      title: 'Päivitetty otsikko',
      url: 'http://paivitettyotsikko on.fi',
      likes: 10,
    }

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedData)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const updatedResponse = await api.get('/api/blogs')
    const updatedBlog = updatedResponse.body.find(b => b.id === blogToUpdate.id)

    
    assert.strictEqual(updatedBlog.title, updatedData.title)
})

test('user creation fails if username already taken', async () => {
  const newUser = {
    username: 'root',
    name: 'tyyppi',
    password: 'salainen',
  }

  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  assert.ok(result.body.error.includes('username must be unique'))
})

test('user creation fails if username is too short', async () => {
  const newUser = {
    username: 'te',
    name: 'Testeri-tarja',
    password: 'salainen',
  }

  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)

  assert.ok(result.body.error.includes('username must be at least 3 characters'))
})

test('user creation fails if password is too short', async () => {
  const newUser = {
    username: 'testeruser',
    name: 'Tester-Terttu',
    password: '12',
  }

  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)

  assert.ok(result.body.error.includes('password must be at least 3 characters'))
})

after(async () => {
  await mongoose.connection.close()
})
