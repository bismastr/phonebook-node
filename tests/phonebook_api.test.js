import { test, after, beforeEach } from "node:test";
import Person from "../models/phonebook.js";
import assert from "node:assert";
import mongoose from "mongoose";
import supertest from "supertest";
import app from "../app.js";
import test_helper from "./test_helper.js";

const api = supertest(app);

beforeEach(async () => {
  await Person.deleteMany({});
  let personObject = new Person(test_helper.initialPerson[0]);
  await personObject.save();
  personObject = new Person(test_helper.initialPerson[1]);
  await personObject.save();
});

test("persons are returned as json", async () => {
  await api
    .get("/api/persons")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("all persons are returned", async () => {
  const response = await api.get("/api/persons");

  assert.strictEqual(response.body.length, test_helper.initialPerson.length);
});

test("there are two persons", async () => {
  const response = await api.get("/api/persons");

  console.log(response.body.length);

  assert.strictEqual(response.body.length, 2);
});

test("the first person is about HTTP methods", async () => {
  const response = await api.get("/api/persons");

  const contents = response.body.map((e) => e.name);
  assert.strictEqual(contents.includes("Bisma"), true);
});

test("a valid person can be added", async () => {
  const newPerson = {
    name: "validPerson",
    number: "031-983129892",
  };

  await api
    .post("/api/persons")
    .send(newPerson)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const personAtEnd = await test_helper.personInDB();
  assert.equal(personAtEnd.length, test_helper.initialPerson.length + 1);

  const name = personAtEnd.map((r) => r.name);

  assert(name.includes("validPerson"));
});

test("person without name is not added", async () => {
  const newPersons = {
    number: "031-390218321",
  };

  await api.post("/api/persons").send(newPersons).expect(400);

  const personAtEnd = await test_helper.personInDB();

  assert.strictEqual(personAtEnd.length, test_helper.initialPerson.length);
});

after(async () => {
  await mongoose.connection.close();
});
