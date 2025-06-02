const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')


const PORT = process.env.POR || 3003

app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())

morgan.token('req-body', (req)=>{
    if (req.method === "POST") {
    return JSON.stringify(req.body)
    }
    return""
}) 

app.use(morgan(":method :url :status :res[content-length] - :response-time ms :req-body"))

let persons =  [
    {
      "name": "Arto Hellas",
      "number": "040-123456",
      "id": "1"
    },
    {
      "name": "Ada Lovelace",
      "number": "39-44-5323523",
      "id": "2"
    },
    {
      "name": "Dan Abramov",
      "number": "12-43-234345",
      "id": "3"
    }
]

app.get("/api/persons", (req, res) => {
  res.send(persons)
})

app.get("/info", (req, res)=> {
res.send(`Phonebook has info for ${persons.length} people <br> ${Date()}`)
})

app.get("/api/persons/:id", (req,res)=>{
    const id = req.params.id
    const person = persons.find(person=>person.id === id)
    if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id
  persons = persons.filter(person => person.id !== id)

  res.status(204).end()
})


const generateId = () => {
   return String(Math.floor(Math.random() * 1000))
}

app.post('/api/persons', (req, res) => {
  const body = req.body

  if (!body.name || !body.number) {
    return res.status(400).json({ 
      error: 'nimi tai numero puuttuu' 
    })
  }

  const nameExists = persons.find(person=>person.name === body.name)
  if (nameExists) {
    res.status(400).json({error: 'nimen pitää olla uniikki'})
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  }

  persons = persons.concat(person)

  res.json(person)
})


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

