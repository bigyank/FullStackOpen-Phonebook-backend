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

app.get("/api/persons/:id", async (req, res, next) => {
  const id = req.params.id;
  try {
    const person = await Person.findById(id);
    if (!person) {
      return res.status(404).send({ error: "Unable to find" });
    }
    res.status(200).send(person);
  } catch (e) {
    console.log(e);
    next(e);
  }
});

app.delete("/api/persons/:id", async (req, res, next) => {
  const id = req.params.id;
  try {
    const result = await Person.findByIdAndDelete(id);
    res.status(204).end();
  } catch (e) {
    next(e);
  }
});

app.get("/info", (req, res) => {
  res.send(
    `Phone book has info for ${
      persons.length
    } people \n ${new Date().toLocaleString()}`
  );
});

app.post("/api/persons", async (req, res, next) => {
  const person = new Person({
    name: req.body.name,
    number: req.body.number,
  });

  try {
    const savedPerson = await person.save();
    res.status(201).send(savedPerson);
  } catch (e) {
    next(e);
  }
});

app.put("/api/persons/:id", async (req, res, next) => {
  const id = req.params.id;
  const update = req.body;
  try {
    const updatedPerson = await Person.findByIdAndUpdate(id, update, {
      new: true,
    });
    res.status(200).send(updatedPerson);
  } catch (e) {
    next(e);
  }
});

const handleInvalidUrl = (req, res) => {
  res.status(404).send({ error: "Unknown endpoint" });
};

app.use(handleInvalidUrl);

const errorHandler = (err, req, res, next) => {
  if (err.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  }
  if (err.name === "ValidationError") {
    return res.status(400).json({ error: err.message });
  }
  next(err);
};
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`server running at ${PORT}`));
