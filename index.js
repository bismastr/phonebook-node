import express from "express";
import morgan from "morgan";
import "dotenv/config";
import Person from "./models/phonebook.js";

const app = express();

app.use(express.static("dist"));
app.use(express.json());
app.use(morgan(":method :url :response-time ms - :res[content-length] :body"));

morgan.token("body", (req, res) => {
  return JSON.stringify(req.body);
});

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (err, req, res, next) => {
  console.error(err.message);

  if (err.name === "CastError") {
    return res.status(400).send({ err: "malformatted id" });
  } else if (err.name === "ValidationError") {
    return res.status(400).json({ error: err.message });
  }

  next(err);
};

const getInfo = () => {
  const personCount = 0;
  const date = new Date();

  return `<div> <p>Phonebook has info for ${personCount} people</p> <p>${date}</p> </div>`;
};

app.get("/info", (req, res) => {
  res.send(getInfo());
});

app.get("/api/persons", (req, res) => {
  Person.find({})
    .then((response) => {
      res.json(response);
    })
    .catch((err) => {
      next(err);
    });
});

app.get("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;

  Person.findById(id)
    .then((response) => {
      if (response) {
        res.json(response);
      } else {
        res.status(400).end();
      }
    })
    .catch((err) => {
      next(err);
    });
});

app.delete("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;
  Person.findByIdAndDelete(id)
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      next(err);
    });
});

app.post("/api/persons", (req, res, next) => {
  const body = req.body;

  const newPerson = new Person({
    name: body.name,
    number: body.number,
  });

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
          next(err);
        });
    }
  });
});

app.put("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;
  const body = req.body;

  Person.findByIdAndUpdate(
    id,
    { number: body.number },
    { new: true, runValidators: true, context: "query" }
  )
    .then((result) => {
      res.json({
        ...result.toJSON(),
        number: body.number,
      });
    })
    .catch((err) => {
      next(err);
    });
});

app.use(unknownEndpoint);
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
