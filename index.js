const express = require("express");
const morgan = require("morgan");
const cors = require("cors")
const app = express();

app.use(cors())
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
			"-",
			JSON.stringify(req.body),
		].join(" ");
	})
);

const phonebook = [
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

app.get("/api/persons", (request, response) => {
	response.json(phonebook);
});

app.get("/api/persons/:id", (request, response) => {
	const id = Number(request.params.id);
	const person = phonebook.find((person) => person.id === id);
	if (!person) {
		return response.status(404).json({ error: "person not found" });
	}
	response.json(person);
});

app.delete("/api/persons/:id", (request, response) => {
	const id = Number(request.params.id);
	const index = phonebook.findIndex((perons) => perons.id === id);
	if (index === -1) {
		return response.status(404).json({ error: "person not found" });
	}
	const deletedPeronn = phonebook.splice(index, 1)[0];
	response.json(deletedPeronn);
});

app.post("/api/persons", (request, response) => {
	const body = request.body;
	if (!body.name || !body.number) {
		return response.status(400).json({ error: "missing data" });
	}

	// if person already exists
	if (
		phonebook.find(
			(person) =>
				person.name === body.name || person.number === body.number
		)
	) {
		return response
			.status(400)
			.json({ error: "name or number already registered" });
	}

	const id = Math.floor(Math.random() * 1e9);
	const person = {
		id: id,
		name: body.name,
		number: body.number,
	};

	phonebook.push(person);

	response.json(person);
});

app.get("/info", (request, response) => {
	const time = new Date();
	const result = `
	<p>Phonebook has info for ${phonebook.length} people</p>
	<p>${time.toString()}</p>
	`;
	response.send(result);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
	console.log(`listening on port, ${PORT}`);
});