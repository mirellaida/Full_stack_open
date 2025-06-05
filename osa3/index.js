const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()

const Person = require('./models/person')

const PORT = process.env.PORT || 3003

app.use(express.json())
app.use(morgan('tiny'))
app.use(express.static('dist'))
app.use(cors())

morgan.token('req-body', (req)=>{
    if (req.method === "POST") {
    return JSON.stringify(req.body)
    }
    return""
})

app.use(morgan(":method :url :status :res[content-length] - :response-time ms :req-body"

)) 

app.get('/info', (req, res, next)=> {
    Person.find().then(personEntry=>{
      res.send(`Phonebook has info for ${personEntry.length} people. \n ${Date()}`)
    }).catch((error)=>next(error))
  })

app.get("/api/persons", (req, res, next)=> {
    Person.find({}).then((persons)=>{
        if(persons) {
             res.json(persons)
        }else{
            res.status(404).end()
        }
    }).catch((error)=> next(error))
})

  app.get("/api/persons/:id", (req, res, next)=>{
  const {id} = req.params
  Person.findById(id).then((person)=> {
    if(person){
      res.json(person)
    } else { 
      res.status(404).end()
    }
  }).catch((error)=>next(error))
  })

app.post('/api/persons', (req, res, next) => {
  const body = req.body

 if (!body.name) return res.status(400).json({ error: 'name missing' })

  if (!body.number)
    return res.status(400).json({ error: 'number missing' })

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person
  .save()
  .then(savedPerson => {
    res.json(savedPerson)
   }).catch((error)=> next(error))
})


app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
  .then(result => {
    res.status(204).end()
  }).catch((error)=> next(error))

})

app.put('/api/persons/:id', (req, res, next)=> {
  const {id} = req.params
  const {name, number} = req.body 

  Person.findByIdAndUpdate(id,{name, number},{new:true, runValidators: true, context: 'query'})
  .then((updatedPerson)=>{
    if(updatedPerson){
      res.json(updatedPerson)
    } else { 
      res.status(404).end()
    }
      
    }).catch((error)=>next(error))
  })


const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});