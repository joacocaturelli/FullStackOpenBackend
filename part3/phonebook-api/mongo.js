// import mongoose from "mongoose";

// // process.argv lee los parametros pasados por consola, name y number son opcionales
// // para ejecutar este codigo seria > node mongo.js myMongodbPassword (name) (number)
// // if (process.argv.length < 3) {
// //   console.log("give a password as argument");
// //   process.exit(1);
// // }

// const password = process.argv[2];

// const url = `mongodb://joacocatu2_db_user:${password}@ac-q7w93le-shard-00-00.egd8jjv.mongodb.net:27017,ac-q7w93le-shard-00-01.egd8jjv.mongodb.net:27017,ac-q7w93le-shard-00-02.egd8jjv.mongodb.net:27017/phonebook?ssl=true&replicaSet=atlas-2zhqpi-shard-0&authSource=admin`;

// mongoose.set("strictQuery", false);

// mongoose.connect(url);

// const personSchema = new mongoose.Schema({
//   name: String,
//   number: Number,
// });

// const Person = mongoose.model("Person", personSchema);

// if (process.argv[3] && process.argv[4]) {
//   const person = new Person({
//     name: process.argv[3],
//     number: process.argv[4],
//   });

//   person.save().then(() => {
//     console.log(`Added ${person.name} number ${person.number} to phonebook`);
//     mongoose.connection.close();
//   });
// } else {
//   console.log("Phonebook:");

//   Person.find({}).then((result) => {
//     result.forEach((person) => {
//       console.log(person.name, person.number);
//     });
//     mongoose.connection.close();
//   });
// }
