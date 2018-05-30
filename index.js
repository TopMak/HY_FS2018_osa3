const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const Yhteystieto = require('./models/yhteystieto')
const app = express()

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

/*--- ROUTES --- */

//Juuri
app.get('/',(req, res) => {
  res.send('<h1>Phonebook REST API</h1> <p>try /api/persons </p>')
})

//Info-"sivu"
app.get('/Info',(req, res) => {
  res.send('<p> Luettelossa on ' + yhteystiedot.persons.length + ' henkilöä </p>' + Date())
})

const yhteystietoFormat = (tieto) => {
  return {
    name: tieto.name,
    number: tieto.number,
    date: tieto.date,
    id: tieto._id
  }
}

/* --- GET all polku --- */

app.get('/api/persons', (req,res) => {
  Yhteystieto
  //Projection key: 0 voidaan "poistaa" palautettava kenttä esim. __v:0 tai date: 0
    .find({}, {__v:0})
    .then(query => {
      res.json(query.map(yhteystietoFormat))
    })
    .catch(error =>{
      res.status(404).send({error: "Error happened! :("})
    })
})

/* --- GET by id polku --- */

app.get('/api/persons/:id', (req,res) => {
  Yhteystieto
    .findById(req.params.id)
    .then(queryById => {
      res.json(yhteystietoFormat(queryById))
    })
    .catch(error =>{
      res.status(404).send({error: "No such id"})
    })
})

/* --- POST uusi yhteystieto --- */

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
  //console.log(yhteystiedot.persons)
  res.status(204).end()
})


/* --- SERVER CONF & START --- */
//Porttimääritys ja käynnistä palvelin
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
