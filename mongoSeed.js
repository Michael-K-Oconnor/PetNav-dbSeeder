const mongoose = require("mongoose");
// const firstHalf = require("./1stData.json");
const secondHalf = require("./2ndData.json");

mongoose.Promise = global.Promise;

console.log(secondHalf[0]);

mongoose
  .connect(
    "mongodb://localhost:27017/ten_mil",
    {
      useNewUrlParser: true,
      authSource: "admin",
      connectTimeoutMS: 1800000, // Give up initial connection after 2 seconds
      socketTimeoutMS: 1800000 // Close sockets after 5 seconds of inactivity }
    }
  )
  .then(() => console.log("connected to database boss!!"))
  .catch(err => console.log("error connecting to database: ", err));

const Schema = mongoose.Schema;

const petSchema = new Schema({
  pet_id: { type: Number, required: true },
  class: String,
  family: String,
  species: String,
  img_url: String
});

const Pet = mongoose.model("Pet", petSchema);

Pet.insertMany(secondHalf.slice(2500000))
  .then(result => {
    console.log("succes!");
    mongoose.disconnect();
  })
  .catch(err => {
    console.log("error writing: ", err);
    mongoose.disconnect();
  });
