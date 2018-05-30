const mongoose = require('mongoose')

//Piilottaa urlin toistaiseksi...
const auth = require('../auth')
const dbUrl = auth.passu

mongoose.connect(dbUrl)

//Skeema
const Yhteystieto = mongoose.model('Yhteystieto', {
  name: String,
  number: String,
  date: Date
})

module.exports = Yhteystieto
