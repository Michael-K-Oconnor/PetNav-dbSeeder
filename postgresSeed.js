// const firstHalf = require("./1stData.json");
// const secondHalf = require("./2ndData.json");

/// BELOW IS COMMAND TO SEEC from CSV file. Need to be in BASH in right folder
// cat 1stData.csv | psql ten_mil -c "COPY pets ( pet_id, class, family, species, img_url) FROM STDIN WITH (FORMAT CSV, HEADER TRUE);"

// let testdata = [
//   {
//     pet_id: 1111,
//     class: "mammal",
//     family: "Felidae",
//     species: "Tiger",
//     img_url: "https://s3.us-east-2.amazonaws.com/petpicks/1111.jpg"
//   },
//   {
//     pet_id: 1112,
//     class: "mammal",
//     family: "Felidae",
//     species: "Lion",
//     img_url: "https://s3.us-east-2.amazonaws.com/petpicks/1112.jpg"
//   }
// ];

// var knex = require("knex")({
//   client: "pg",
//   connection: {
//     username: "student",
//     password: "student",
//     database: "ten_mil"
//   }
// });

// knex
//   .batchInsert("pets", firstHalf, 1000000)
//   .then(() => {
//     console.log("New table created");
//     knex.destroy();
//   })
//   .catch(err => {
//     console.log("There was an err: ", err);
//     knex.destroy();
//   });

/// BELOW IS COMMAND TO SEEC from CSV file. Need to be in BASH in right folder
// cat 1stData.csv | psql ten_mil -c "COPY pets ( pet_id, class, family, species, img_url) FROM STDIN WITH (FORMAT CSV, HEADER TRUE);"
