const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors');
const middleware = require('./utils/middleware')
const config = require('./utils/config')
const logger = require('./utils/logger')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')


const app = express()
console.log('Trying to connect with this URI:', config.MONGODB_URI)

mongoose
.connect(config.MONGODB_URI)
.then(() => {
    logger.info('Connected to MongoDB')
  })
  .catch((error) => {
    logger.error('Error connecting to MongoDB:', error.message)
  })

app.use(express.json())
app.use(cors())
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)


module.exports = app