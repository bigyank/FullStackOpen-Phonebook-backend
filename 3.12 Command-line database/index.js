const mongoose = require("mongoose");
const Person = require("./models/phonebook");
require("./database/database");

const displayAll = async () => {
  try {
    const persons = await Person.find({});
    persons.forEach((person) => console.log(person.name, person.number));
  } catch (e) {
    console.log(e);
  }
  mongoose.connection.close();
};

const addPerson = async () => {
  const person = new Person({
    name: process.argv[2],
    number: process.argv[3],
  });
  try {
    const personSaved = await person.save();
    console.log(personSaved);
  } catch (e) {
    console.log(e);
  }
  mongoose.connection.close();
};

if (process.argv.length < 3) return displayAll();

addPerson();
