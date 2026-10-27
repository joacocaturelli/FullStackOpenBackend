import express, { response } from "express";

const app = express();

app.use(express.json());

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
];

// Api Health
app.get("/", (req, res) => {
  res.send("<h1>Api working</h1>");
});

// Get all persons
app.get("/api/persons", (req, res) => {
  res.json(persons);
});

// Get one person by id
app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);

  const person = persons.find((p) => p.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

// Remove one person by id from the phonebook
app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);

  const person = persons.find((person) => person.id === id);

  if (person) {
    persons = persons.filter((p) => p.id !== id);
    res.status(204).end();
  } else {
    res.status(404).end();
  }
});

// Function to create a new id number
const generateId = () => {
  return Math.floor(Math.random() * 9000000 + 1000000);
};

// Create a new person for the phonebook
app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: "content missing",
    });
  }

  if (persons.some((p) => p.name.toLowerCase() === body.name.toLowerCase())) {
    return res.status(400).json({
      error: "name must be unique",
    });
  }

  let newId = generateId();

  while (persons.some((p) => p.id === newId)) {
    newId = generateId();
  }

  const person = {
    id: newId,
    name: body.name,
    number: body.number,
  };

  persons.push(person);

  res.status(201).json(person);
});

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

  res.send(`<p>Phonebooh has info for ${persons.length} people</p><p>${date}.</p>`);
});

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
