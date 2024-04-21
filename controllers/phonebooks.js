import express from "express";
import Person from "../models/phonebook.js";

const phoneBooksRouter = express.Router();

phoneBooksRouter.get("/", (req, res, next) => {
  Person.find({})
    .then((response) => {
      res.json(response);
    })
    .catch((err) => {
      next(err);
    });
});

phoneBooksRouter.get("/:id", (req, res, next) => {
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

phoneBooksRouter.delete("/:id", (req, res, next) => {
  const id = req.params.id;
  Person.findByIdAndDelete(id)
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      next(err);
    });
});

phoneBooksRouter.post("/", (req, res, next) => {
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

phoneBooksRouter.put("/:id", (req, res, next) => {
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

export default phoneBooksRouter;
