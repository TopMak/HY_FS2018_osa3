const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(express.static('build'))

morgan.token('msg', function (req, res) { return JSON.stringify(req.body) })

//Custom asetukset morganille
const logger = morgan(function (tokens, req, res) {
  //console.log(req.body);
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.msg(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms'
  ].join(' ')
})

//Logger middleware
//app.use(morgan('tiny'))
app.use(logger)

const generateID = () => {
  return Math.ceil(Math.random() * 100000)
}

let yhteystiedot = {
"persons": [
  {
    "name": "Arto Hellas",
    "number": "040-123456",
    "id": 1
  },
  {
    "name": "Martti Tienari",
    "number": "040-123456",
    "id": 2
  },
  {
    "name": "Arto Järvinen",
    "number": "040-123456",
    "id": 3
  },
  {
    "name": "Lea Kutvonen",
    "number": "040-123456",
    "id": 4
  },
  {
    "name": "Martti Vartti",
    "number": "045-9287828",
    "id": 5
  }
]}

/*--- ROUTES --- */

//Juuri
app.get('/',(req, res) => {
  res.send('<h1>Phonebook REST API</h1> <p>try /api/persons </p>')
})

//Info-"sivu"
app.get('/Info',(req, res) => {
  res.send('<p> Luettelossa on ' + yhteystiedot.persons.length + ' henkilöä </p>' + Date())
})

//GET all polku
app.get('/api/persons', (req,res) => {
  res.json(yhteystiedot.persons)
})

//GET by id polku
app.get('/api/persons/:id', (req,res) => {
  const id = Number(req.params.id)
  const henkilo = yhteystiedot.persons.find(n => n.id === id)
  //console.log(henkilo);
  if(henkilo){
    res.json(henkilo)
  } else {
    res.status(404).end()
  }
})

//POST uusi yhteystieto
app.post('/api/persons', (req,res) => {
 const viesti = req.body

  if (viesti.name === undefined || viesti.number === undefined) {
    console.log("Post with content missing")
    return res.status(400).json({error: 'name or number missing'})
  } else if (yhteystiedot.persons.find(n => n.name.toLowerCase() === viesti.name.toLowerCase())) { //Nimi on jo luettelossa
       console.log("Nimi exists");
       return res.status(400).json({error: 'name must be unique'})
  }

  const uusiHenkilo = {
    name: viesti.name,
    number: viesti.number,
    id: generateID()
  }
  //console.log(uusiHenkilo)
  yhteystiedot.persons = yhteystiedot.persons.concat(uusiHenkilo)
  //console.log(yhteystiedot.persons);
  res.json(uusiHenkilo)
})

//DELETE by id polku
app.delete('/api/persons/:id', (req,res) => {
  const id = Number(req.params.id)
  yhteystiedot.persons = yhteystiedot.persons.filter(n => n.id !== id)
  console.log(yhteystiedot.persons)
  res.status(204).end()
})


/*--- SERVER CONF & START --- */
//Porttimääritys ja käynnistä palvelin
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
