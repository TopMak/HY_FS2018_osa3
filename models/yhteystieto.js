const mongoose = require('mongoose')

require('dotenv').config();
//Piilottaa urlin toistaiseksi...
//const auth = require('../auth')
const dbUrl = process.env.DB_URL || process.env.DB_URL_DEVEL

mongoose.connect(dbUrl)

//Lisätään skeemaan unique kenttä
const yhteystietoSkeema = new mongoose.Schema({
  name: {
      type:String,
      required: true,
      unique: true
    },
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
    //date: tieto.date,   /* Tämä Teht3.18 mukaisesti */
    id: tieto._id
  }
}

//const Yhteystieto = mongoose.model('Yhteystieto', yhteystietoSkeema)

module.exports = mongoose.model('Yhteystieto', yhteystietoSkeema)
