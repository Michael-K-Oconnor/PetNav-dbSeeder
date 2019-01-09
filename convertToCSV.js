const fs = require("fs");
// const testD = require('./test.json')
// const firstHalf = require("./1stData.json");
const secondHalf = require("./2ndData.json");

let newCSV = "pet_id,class,family,species,img_url\n";

secondHalf.forEach(entry => {
  let currEntry = "" + entry.pet_id + ',' + entry.class + ',' 
  + entry.family + ',' + entry.species + ',' + entry.img_url + '\n'
  newCSV += currEntry
})

fs.writeFile("2ndData.csv", newCSV, () => {
  console.log('compelte')
})