import mongoose from "mongoose";
import config from "../utils/config.js";

mongoose.set("strictQuery", false);

const url = config.MONGODB_URI;
console.log(url);

mongoose
  .connect(url)
  .then(() => {
    console.log("conected to mongodb");
  })
  .catch((error) => {
    console.log("failed to connect :" + error.message);
  });

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    required: true,
    validate: {
      validator: function numberValidation(number) {
        return /\d{2,3}-\d+/.test(number);
      },
    },
  },
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Person = mongoose.model("Person", personSchema);

export default Person;
