import "dotenv/config";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import { Person } from "./models/person.js";

const app = express();

app.use(cors());
app.use(express.static("dist"));
app.use(express.json());
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
    res.send(`<p>Phonebook has info for ${people.length} people</p><p>${date}.</p>`);
  });
});

// Get all people
app.get("/api/people", (req, res) => {
  Person.find({}).then((people) => {
    res.json(people);
  });
});

// Get one person by id
app.get("/api/people/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => next(error));
});

// Create a new person for the phonebook
app.post("/api/people", (req, res, next) => {
  const { name, number } = req.body;

  // if (!name || !number) {
  //   return res.status(400).json({
  //     error: "name or number missing",
  //   });
  // }

  const person = new Person({
    name: name,
    number: number,
  });

  person
    .save()
    .then((savedPerson) => res.status(201).json(savedPerson))
    .catch((error) => next(error));
});

app.put("/api/people/:id", (req, res, next) => {
  const { number } = req.body;

  Person.findById(req.params.id)
    .then((person) => {
      if (!person) {
        return res.status(404).end();
      }

      person.number = number;

      return person.save().then((updatedPerson) => {
        res.json(updatedPerson);
      });
    })
    .catch((error) => next(error));
});

// Remove one person by id from the phonebook
app.delete("/api/people/:id", (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then((result) => {
      res.status(204).end();
    })
    .catch((error) => next(error));
});

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, req, res, next) => {
  console.log(error.message);

  if (error.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return res.status(400).send({ error: error.message });
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`server running on http://localhost:${PORT}`);
});
