const mongoose = require('mongoose')

//Piilottaa urlin toistaiseksi...
const auth = require('../auth')
const dbUrl = auth.passu

mongoose.connect(dbUrl)

//Skeema
const yhteystietoSkeema = new mongoose.Schema({
  name: String,
  number: String,
  date: Date
})

//JÄRJESTYKSELLÄ ON VÄLIÄ!! FUNKTIO ENSIN
//persons.map(Person.format) --> taulukkomuotoilu
//Person.format(person) -->yksittäin
//Format metodi
yhteystietoSkeema.statics.format = function(tieto) {
  return {
    name: tieto.name,
    number: tieto.number,
    date: tieto.date,
    id: tieto._id
  }
}

//const Yhteystieto = mongoose.model('Yhteystieto', yhteystietoSkeema)

module.exports = mongoose.model('Yhteystieto', yhteystietoSkeema)
