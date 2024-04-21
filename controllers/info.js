import express from "express";

const infoRouter = express.Router();

const getInfo = () => {
  const personCount = 0;
  const date = new Date();

  return `<div> <p>Phonebook has info for ${personCount} people</p> <p>${date}</p> </div>`;
};

infoRouter.get("/info", (req, res) => {
  res.send(getInfo());
});

export default infoRouter