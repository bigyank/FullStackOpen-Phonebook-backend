const express = require("express");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

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

var accessLogStream = fs.createWriteStream(path.join(__dirname, "access.log"), {
  flags: "a",
});

app.use(
  morgan(
    `:method :url :status :res[content-length] :response-time ms \n :req \n :time\n`,
    { stream: accessLogStream }
  )
);

let persons = [
  {
    id: 1,
    name: "Leanne Graham",
    username: "Bret",
    email: "Sincere@april.biz",
    address: {
      street: "Kulas Light",
      suite: "Apt. 556",
      city: "Gwenborough",
      zipcode: "92998-3874",
      geo: {
        lat: "-37.3159",
        lng: "81.1496",
      },
    },
    phone: "1-770-736-8031 x56442",
    website: "hildegard.org",
    company: {
      name: "Romaguera-Crona",
      catchPhrase: "Multi-layered client-server neural-net",
      bs: "harness real-time e-markets",
    },
  },
  {
    id: 2,
    name: "Ervin Howell",
    username: "Antonette",
    email: "Shanna@melissa.tv",
    address: {
      street: "Victor Plains",
      suite: "Suite 879",
      city: "Wisokyburgh",
      zipcode: "90566-7771",
      geo: {
        lat: "-43.9509",
        lng: "-34.4618",
      },
    },
    phone: "010-692-6593 x09125",
    website: "anastasia.net",
    company: {
      name: "Deckow-Crist",
      catchPhrase: "Proactive didactic contingency",
      bs: "synergize scalable supply-chains",
    },
  },
];

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((person) => id === person.id);
  if (!person) {
    return res.status(404).end();
  }
  res.json(person);
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

app.post("/api/persons", (req, res) => {
  if (!req.body.name || !req.body.number) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const person = persons.find((person) => person.name === req.body.name);
  if (person) {
    return res.status(409).json({ error: "Dublicate name" });
  }

  const id = persons.length
    ? Math.max(...persons.map((person) => person.id))
    : 0;

  const newPerson = { id: id + 1, ...req.body };
  persons = [...persons, newPerson];
  res.status(201).json(newPerson);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`server running at ${PORT}`));
