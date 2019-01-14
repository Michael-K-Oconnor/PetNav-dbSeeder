const mongoose = require("mongoose");
const fs = require("fs");

mongoose.Promise = global.Promise;

mongoose
  .connect(
    "mongodb://localhost:27017/ten_mil",
    {
      useNewUrlParser: true
      // server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
      // replset: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }
    }
  )
  .then(() => console.log("connected to database boss!!"))
  .catch(err => console.log("error connecting to database: ", err));

const petSchema = new mongoose.Schema({});
const Pet = mongoose.model("Pet", petSchema);

let testResultsArr = [];

//////////////////////////////////////////////////
///////// SERIAL DB QUERY FUNCTIONS  /////////////
//////////////////////////////////////////////////

const findPetTest = async pet_id => {
  let testResult = { test: "findPet", input: pet_id, data: [] };
  for (let i = 0; i < maxIndex; i++) {
    let result = await Pet.find({ pet_id }, "family").explain("executionStats");
    testResult.data.push(result[0]);
  }
  testResultsArr.push(testResult);
};

const findOnePetTest = async pet_id => {
  let testResult = { test: "findOnePet", input: pet_id, data: [] };
  for (let i = 0; i < maxIndex; i++) {
    let result = await Pet.findOne({ pet_id }, "family").explain(
      "executionStats"
    );
    testResult.data.push(result);
  }
  testResultsArr.push(testResult);
};

const findAllFamily = async family => {
  let testResult = { test: "findAllFamily", input: family, data: [] };
  for (let i = 0; i < maxIndex; i++) {
    let result = await Pet.find({ family }).explain("executionStats");
    testResult.data.push(result[0]);
  }
  testResultsArr.push(testResult);
};

const findSomeFamily = async family => {
  let testResult = { test: "findSomeFamily", input: family, data: [] };
  for (let i = 0; i < maxIndex; i++) {
    let result = await Pet.find({ family })
      .limit(20)
      .explain("executionStats");
    testResult.data.push(result[0]);
  }
  testResultsArr.push(testResult);
};

///////////////////////////////////////////////////
// HELPER FUNCTIONS FOR PARALLEL DB QUERY TESTS  //
///////////////////////////////////////////////////

const findOnePetPromise = pet_id => {
  return Pet.findOne({ pet_id }, "family").explain("executionStats");
};

const findFamilyPromise = family => {
  return Pet.find({ family })
    .limit(20)
    .explain("executionStats");
};

const petIndexGen = num => {
  let arr = [];
  let divisor = Math.floor(10000000 / num);
  let start = Math.floor(divisor / 2);
  for (let i = 0; i < num; i++) {
    arr.push(start + i * divisor);
  }
  return arr;
};

const familyNameGen = async num => {
  let arr = [];
  let results = await Pet.find({}, "family").limit(num);
  results.forEach(result => {
    let fam = JSON.parse(JSON.stringify(result)).family;
    arr.push(fam);
  });
  return arr;
};

///////////////////////////////////////////////////
//////////// PARALLEL DB QUERY TESTS  /////////////
///////////////////////////////////////////////////

const multiFindPet = async num => {
  let testResult = { test: "multiFindPet", input: num, data: [] };
  let arr = petIndexGen(num);
  let promiseArr = arr.map(pet_id => {
    return findOnePetPromise(pet_id);
  });
  let result = await Promise.all(promiseArr);
  testResult.data = result;
  testResultsArr.push(testResult);
};

const multiFindFamily = async num => {
  let testResult = { test: "multiFindFamily", input: num, data: [] };
  let arr = await familyNameGen(num);
  let promiseArr = arr.map(family => {
    return findFamilyPromise(family);
  });
  let result = await Promise.all(promiseArr);
  testResult.data = result[0];
  testResultsArr.push(testResult);
};

///////////////////////////////////////////////////
//////////// MAIN TESTER FUNCTION  ////////////////
///////////////////////////////////////////////////

async function serialTester() {
  await findPetTest(5);
  await findPetTest(5000000);
  await findPetTest(9999995);
  console.log("FindPetTest Complete");
  await findOnePetTest(5);
  await findOnePetTest(5000000);
  await findOnePetTest(9999995);
  console.log("FindOnePetTest Complete");
  await findAllFamily("Lind");
  await findAllFamily("Carter");
  await findAllFamily("Kuhlman");
  console.log("FindAllFamilyTest Complete");
  await findSomeFamily("Lind");
  await findSomeFamily("Carter");
  await findSomeFamily("Kuhlman");
  console.log("FindSomeFamilyTest Complete");
  await multiFindPet(2);
  await multiFindPet(100);
  await multiFindPet(1000);
  console.log("FindMultiPetTest Complete");
  await multiFindFamily(10);
  await multiFindFamily(100);
  await multiFindFamily(1000);
  console.log("FindMultiFamilyTest Complete");

  let finalData = "Test,Key,AvgTime,StdDev\n";
  for (let test of testResultsArr) {
    let resultString = `${test.test},${test.input},`;
    let execTimes = [];
    for (let query of test.data) {
      console.log(query);
      execTimes.push(query.executionStats.executionTimeMillis);
    }
    resultString += `${average(execTimes)},${standardDeviation(execTimes)}\n`;
    finalData += resultString;
  }
  fs.writeFile("MongoTest1.csv", finalData, () => {
    console.log("file written");
  });
  mongoose.disconnect();
}

let maxIndex = 2;
serialTester();

function standardDeviation(values) {
  var avg = average(values);

  var squareDiffs = values.map(function(value) {
    var diff = value - avg;
    var sqrDiff = diff * diff;
    return sqrDiff;
  });

  var avgSquareDiff = average(squareDiffs);

  var stdDev = Math.sqrt(avgSquareDiff);
  return stdDev;
}

function average(data) {
  var sum = data.reduce(function(sum, value) {
    return sum + value;
  }, 0);

  var avg = sum / data.length;
  return avg;
}
