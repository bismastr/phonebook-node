import express from "express";
import morgan from "morgan";
import "dotenv/config";
import Person from "./models/phonebook.js";

const app = express();

app.use(express.json());
app.use(express.static("dist"));
app.use(morgan(":method :url :response-time ms - :res[content-length] :body"));

morgan.token("body", (req, res) => {
  return JSON.stringify(req.body);
});

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
  {
    id: 5,
    name: "Bisma",
    number: "3",
  },
];

const getInfo = () => {
  const personCount = persons.length;
  const date = new Date();

  return `<div> <p>Phonebook has info for ${personCount} people</p> <p>${date}</p> </div>`;
};

app.get("/info", (req, res) => {
  res.send(getInfo());
});

app.get("/api/persons", (req, res) => {
  Person.find({}).then((response) => {
    res.json(response);
  });
});

app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;

  Person.findById(id)
    .then((response) => {
      res.json(response);
    })
    .catch((err) => {
      res.status(404).json({
        code: "404",
        message: err,
      });
    });
});

app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  Person.findByIdAndDelete(id)
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.status(404).json({
        code: "404",
        message: err,
      });
    });
});

app.post("/api/persons", (req, res) => {
  const body = req.body;

  const newPerson = new Person({
    name: body.name,
    number: body.number,
  });

  if (!newPerson.name || !newPerson.number) {
    return res.status(402).json({
      message: "Missing request body",
    });
  }

  Person.findOne({ name: newPerson.name }).then((result) => {
    if (result) {
      res.status(400).json({
        message: "Duplicated",
      });
    } else {
      newPerson
        .save()
        .then((response) => {
          res.status(200).json(response);
        })
        .catch((err) => {
          res.status(400).json({
            stats: 400,
            message: err,
          });
        });
    }
  });
});

app.put("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const body = req.body;
  let updatedPerson = undefined;

  for (let p of persons) {
    if (p.id === id) {
      console.log(body.number);
      p.number = body.number;
      updatedPerson = p;
      console.log(updatedPerson);
      break;
    }
  }

  if (updatedPerson) {
    res.json(updatedPerson);
  } else {
    res.status(402).json({
      message: `Cannot updatePerson with id ${id}`,
    });
  }
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
