import Person from "../models/phonebook.js";

const initialPerson = [
  {
    name: "Bisma",
    number: "031-213123",
  },
  {
    name: "Satria",
    number: "031-32102113",
  },
];

const personInDB = async () => {
  const person = await Person.find({});
  return person.map((person) => person.toJSON());
};

const nonExistingId = async () => {
  const person = new Person({ content: "031-32918312 " });
  await person.save();
  await person.deleteOne();

  return person._id.toString();
};

export default { personInDB, nonExistingId, initialPerson };
