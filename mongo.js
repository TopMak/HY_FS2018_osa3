const mongoose = require('mongoose')
//Omat
require('dotenv').config();
//const auth = require('./auth')

//Piilottaa urlin toistaiseksi...
//const dbUrl = auth.passu
const dbUrl = process.env.DB_URL

mongoose.connect(dbUrl)

//Skeema
const Yhteystieto = mongoose.model('Yhteystieto', {
  name: String,
  number: String,
  date: Date
})

let uusiYhteystieto = null
if(process.argv.length === 2){

  console.log("Luettelossa:");
  Yhteystieto
  .find({})
  .then(result => {
    result.forEach(note => {
      console.log(note)
    })
    mongoose.connection.close()
  })

} else {
  //Uusi tietue
  console.log("Lisätään " + process.argv[2] + " numero " + process.argv[3] + " luetteloon.")
  uusiYhteystieto = new Yhteystieto({
    name: process.argv[2],
    number: process.argv[3],
    date: new Date()
  })

  uusiYhteystieto
    .save()
    .then( response => {
      //console.log(response, " Note saved!")
      mongoose.connection.close()
    })
}

// process.argv.forEach(function (val, index, array) {
//   console.log(index + ': ' + val);
// });
