const express = require('express')
const bodyParser = require('body-parser')
const app = express()

app.use(bodyParser.json())

const yhteystiedot = {
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



//Juuri
app.get('/',(req, res) => {
  res.send('<h1>Phonebook REST API</h1> <p>try /api/persons </p>')
})

//Info-"sivu"
app.get('/Info',(req, res) => {
  res.send('<p> Luettelossa on ' + yhteystiedot.persons.length + ' henkilöä </p>' + Date())
})

//GET all metodi
app.get('/api/persons', (req,res) => {
  res.json(yhteystiedot.persons)
})

//console.log(yhteystiedot);
//Porttimääritys ja käynnistä palvelin
const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
