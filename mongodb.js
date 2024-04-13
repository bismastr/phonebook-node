import mongoose from "mongoose";

mongoose.set("strictQuery", false);

const password = encodeURIComponent(process.argv[2]);
const name = process.argv[3];
const number = process.argv[4];
const url = `mongodb+srv://bismasatrian:${password}@bismastr-cluster0.vfoqw1s.mongodb.net/personApp?retryWrites=true&w=majority&appName=bismastr-cluster0`;

console.log(url);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);
const person = new Person({
  name: name,
  number: number,
});

console.log(person.name);
if (!person.name) {
  console.log(name);
  Person.find({}).then((result) => {
    result.forEach((person) => {
      console.log(person);
      mongoose.connection.close();
    });
  });
} else {
  person.save().then((result) => {
    console.log(`added ${name} number ${number} to phonebook`);
    mongoose.connection.close();
  });
}
