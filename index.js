const express = require("express");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const Person = require("./models/phonebook");
require("./db/db");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("build"));

morgan.token("req", (req, res) => {
  return JSON.stringify(req.body, null, 2);
});

morgan.token("time", () => {
  return new Date().toLocaleString();
});

let accessLogStream = fs.createWriteStream(path.join(__dirname, "access.log"), {
  flags: "a",
});

app.use(
  morgan(
    `:method :url :status :res[content-length] :response-time ms \n :req \n :time\n`,
    { stream: accessLogStream }
  )
);

app.get("/api/persons", async (req, res) => {
  try {
    const persons = await Person.find({});
    res.status(200).send(persons);
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: "Unable to fetch data" });
  }
});

app.get("/api/persons/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const person = await Person.findById(id);
    if (!person) {
      res.status(404).send({ error: "Unable to find" });
    }
    res.status(200).send(person);
  } catch (e) {
    console.log(e);
    res.status(500).end();
  }
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const delPerson = persons.filter((person) => person.id === id);
  persons = persons.filter((person) => person.id !== id);
  res.status(204).end();
});

app.get("/info", (req, res) => {
  res.send(
    `Phone book has info for ${
      persons.length
    } people \n ${new Date().toLocaleString()}`
  );
});

app.post("/api/persons", async (req, res) => {
  if (!req.body.name || !req.body.number) {
    return res.status(400).send({ error: "Missing fields" });
  }

  const person = new Person({
    name: req.body.name,
    number: req.body.number,
  });

  try {
    const savedPerson = await person.save();
    res.status(201).send(savedPerson);
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: "Unable to save data" });
  }
});

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`server running at ${PORT}`));
