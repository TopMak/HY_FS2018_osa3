const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const Yhteystieto = require('./models/yhteystieto')
const app = express()

app.use(bodyParser.json())
app.use(express.static('build'))

//morgan.token('msg', function (req, res) { return JSON.stringify(req.body) })
morgan.token('msg', function (req) { return JSON.stringify(req.body) })

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

/*--- MIDDLEWARE --- */

//Logger middleware
//app.use(morgan('tiny'))
app.use(logger)


/*--- ROUTES --- */

//Juuri
// app.get('/',(req, res) => {
//   res.send('<h1>Phonebook REST API</h1><p>see /info </p> <p>try /api/persons </p>')
// })

/*--- Info-"sivu" --- */

app.get('/info',(req, res) => {
  Yhteystieto
    .find({},{ __v: 0 } )
    .then(notes => {
      console.log(notes.length)
      res.send('<p> Luettelossa on ' + notes.length + ' henkilöä </p>' + Date())
    })
    .catch(() => {
      console.log('Yhteysvirhe?')
      res.status(404).send({ error: 'Connection error' })
    })

})


/* --- GET ALL polku --- */

app.get('/api/persons', (req,res) => {
  Yhteystieto
  //Projection { key: 0 } voidaan "poistaa" palautettava kenttä esim. __v:0 tai date: 0
    .find({}, { __v:0 })
    .then(query => {
      //res.json(query.map(yhteystietoFormat))
      //res.json(Yhteystieto.format(query))
      res.json(query.map(Yhteystieto.format))
      //console.log(query.map(Yhteystieto.format));
    })
    .catch(error => {
      console.log(error)
      res.status(404).send({ error: 'Error happened! :(' })
    })
})

/* --- GET USER by id polku--- */

app.get('/api/persons/:id', (req,res) => {
  Yhteystieto
    .findById(req.params.id)
    .then(queryById => {
      res.json(Yhteystieto.format(queryById))
      //console.log(Yhteystieto.format(queryById));
    })
    .catch(() => {
      res.status(404).send({ error: 'No such id' })
    })
})

/* --- POST NEW USER, uusi yhteystieto --- */

app.post('/api/persons', (req,res) => {
  const viesti = req.body

  if (viesti.name === undefined || viesti.number === undefined) {
    console.log('Post with content missing')
    return res.status(400).json({ error: 'name or number missing' })
  }

  const uusiHenkilo = new Yhteystieto({
    name: viesti.name,
    number: viesti.number,
    date: new Date()
  })

  uusiHenkilo
    .save()
    .then(savedPerson => {
      res.json(Yhteystieto.format(savedPerson))
    })
    .catch(error => {
      //Tulostetaan konsoliin virhe, kerrotaan nimi
      console.log(error.name)
      res.status(405).send({ error: 'Name must be unique!' })
    })
})

/* --- DELETE USER by id --- */

app.delete('/api/persons/:id', (req,res) => {

  Yhteystieto
    .findByIdAndRemove(req.params.id)
    .then(() => {
      //console.log(poistettuTieto);
      res.status(204).end()
    })
    .catch(error => {
      console.log(error)
      res.status(400).send({ error: 'not valid id' })
    })

  // yhteystiedot.persons = yhteystiedot.persons.filter(n => n.id !== id)
  // //console.log(yhteystiedot.persons)
  //res.status(204).end()
})

/* --- UPDATE USER by id, päivitä olemassa oleva yhteystieto --- */

app.put('/api/persons/:id', (req,res) => {

  if(!req.body.number){
    //console.log("Numero falsy, ", req.body.number);
    return res.status(400).json({ error: 'Number missing or empty' })
  }

  //Kenties olisi hyvä päivittää myös aika??
  const paivYhteyst = {
    number: req.body.number
  }
  // { new: true } katso findByIdAndUpdate options kohta docs
  Yhteystieto
    .findByIdAndUpdate(req.params.id, paivYhteyst, { new : true })
    .then(paivHenkilo => {
      res.json(Yhteystieto.format(paivHenkilo))
    })
    .catch( () => {
      //Tilanne jossa numero on muualla poistettu
      res.status(400).send({ error: 'Invalid id' })
    })

})

/* --- Virhe: tuntemattomat polut --- */

const error = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

/*TODO bodyParserin virheet? -> SyntaxError,
 jos parsettava pyyntö ei ole eheä JSON.
 Express vastaa defaulttina 400. Testattu Postmanilla.
 */

app.use(error)

/* --- SERVER CONF & START --- */
//Porttimääritys ja käynnistä palvelin
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
