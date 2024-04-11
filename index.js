import express from "express";
import morgan from "morgan";

const app = express();

app.use(express.json());
app.use(express.static("dist"));

morgan.token("body", (req, res) => {
  return JSON.stringify(req.body);
});

app.use(morgan(":method :url :response-time ms - :res[content-length] :body"));

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
  res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((p) => p.id === id);

  if (!person) {
    res.status(404).json({
      code: "404",
      message: "Id not found",
    });
  }

  res.json(person);
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((p) => p.id !== id);

  res.status(200).json();
});

const getId = () => {
  return Math.floor(Math.random() * 9999);
};

const checkDuplicateName = (name) => {
  const findPerson = persons.find(
    (p) => p.name.toLowerCase() === name.toLowerCase()
  );

  return findPerson;
};

app.post("/api/persons", (req, res) => {
  const body = req.body;

  const person = {
    id: getId(),
    name: body.name,
    number: body.number,
  };

  if (!person.name || !person.number) {
    return res.status(402).json({
      message: "Missing request body",
    });
  }

  if (checkDuplicateName(person.name)) {
    return res.status(409).json({
      error: "name must be unique",
    });
  }

  persons = persons.concat(person);

  res.json(person);
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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
