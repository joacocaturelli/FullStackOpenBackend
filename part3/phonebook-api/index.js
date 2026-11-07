import "dotenv/config";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import { Person } from "./models/person.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("dist"));
app.use(
  morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
      "-",
      tokens["response-time"](req, res),
      "ms",
      JSON.stringify(req.body),
    ].join(" ");
  }),
);

// Api Health
app.get("/", (req, res) => {
  res.send("<h1>Api working</h1>");
});

// Get all people
app.get("/api/people", (req, res) => {
  Person.find({}).then((people) => {
    res.json(people);
  });
});

// Get one person by id
app.get("/api/people/:id", (req, res) => {
  Person.findById(req.params.id).then((person) => {
    res.json(person);
  });
});

// Remove one person by id from the phonebook
app.delete("/api/people/:id", (req, res) => {
  Person.findByIdAndDelete(req.params.id).then((result) => {
    res.status(204).end();
  });
});

// Create a new person for the phonebook
app.post("/api/people", (req, res) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: "name or number missing",
    });
  }

  Person.find({}).then((people) => {
    if (people.some((p) => p.name.toLowerCase() === body.name.toLowerCase())) {
      return res.status(400).json({
        error: "name must be unique",
      });
    } else {
      const person = new Person({
        name: body.name,
        number: body.number,
      });

      person.save().then((savedPerson) => {
        res.status(201).json(savedPerson);
      });
    }
  });
});

// Get info about the api
app.get("/info", (req, res) => {
  const date = new Date().toLocaleString("en-GB", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "Europe/Madrid",
    timeZoneName: "long",
  });

  Person.find({}).then((people) => {
    res.send(`<p>Phonebooh has info for ${people.length} people</p><p>${date}.</p>`);
  });
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`server running on http://localhost:${PORT}`);
});
