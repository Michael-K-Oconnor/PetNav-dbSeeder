// EXPLAIN ANALYSE SELECT * FROM pets WHERE pet_id = 52;

// or turn on timing on postgres terminal with command

// \timing

// Using explain analyze yields times that are approximately
// double what I see when using \timing, which is the opposite
// of what I would expect based on the comments here regarding
// network latency. I suspect that there is overhead in the
// normal execution of analyze that adds to the query time.
// Based on the docs, I think that

// EXPLAIN (ANALYZE, TIMING OFF) SELECT foo FROM bar

// will give you more useful timing information.
// See postgresql.org/docs/9.6/static/sql-explain.html for details

const db = require("knex")({
  client: "pg",
  connection: {
    database: "ten_mil"
  }
});

let testResultsArr = [];

//////////////////////////////////////////////////
///////// SERIAL DB QUERY FUNCTIONS  /////////////
//////////////////////////////////////////////////

const findPetTest = async pet_id => {
  let testResult = { test: "findPet", input: pet_id, data: [] };
  for (let i = 0; i < maxIndex; i++) {
    let result = await db.raw(
      "EXPLAIN (ANALYZE, TIMING OFF) SELECT family FROM pets WHERE pet_id = 52"
    );
    let execTime = result.rows[result.rows.length - 1]["QUERY PLAN"].split(
      " "
    )[2];
    testResult.data.push(execTime);
  }
  testResultsArr.push(testResult);
  console.log(testResultsArr);
};

let maxIndex = 2;
findPetTest(3);

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
