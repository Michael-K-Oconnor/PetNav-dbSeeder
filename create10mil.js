const faker = require("faker");
const fs = require("fs");

let hugeArr = [];

for (let i = 1; i <= 5000000; i++) {
  hugeArr.push({
    pet_id: i + 5000000,
    class: faker.name.firstName(),
    family: faker.name.lastName(),
    species: faker.commerce.department(),
    img_url: faker.image.animals()
  });
}

console.log("1st array generated");

fs.writeFile("2ndData.json", JSON.stringify(hugeArr), () => {
  console.log("1st write finished");
});

// hugeArr2 = [];

// for (let i = 1; i <= 5000000; i++) {
//   hugeArr2.push({
//     pet_id: i + 5000000,
//     class: faker.name.firstName(),
//     family: faker.name.lastName(),
//     species: faker.commerce.department(),
//     img_url: faker.image.animals()
//   });
// }

// console.log("2nd array generated");

// fs.writeFile("2ndData.json", JSON.stringify(hugeArr2), () => {
//   console.log("2nd finished");
// });
