require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();

const Person = require("./models/Person");

// morgan for logging
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

app.use(cors());
app.use(express.json());
app.use(express.static("dist"));

app.get("/api/persons", (request, response) => {
	Person.find().then((persons) => {
		response.json(persons);
	});
});

app.get("/api/persons/:id", (request, response) => {
	Person.findById(request.params.id)
		.then((person) => {
			if (!person) {
				return response.status(404).json({ error: "person not found" });
			}
			response.json(person);
		})
		.catch((error) => next(error));
});

app.delete("/api/persons/:id", (request, response) => {
	Person.findByIdAndDelete(request.params.id)
		.then((deletedPerson) => {
			response.json(deletedPerson);
		})
		.catch((error) => next(error));
});

app.post("/api/persons", (request, response) => {
	const body = request.body;
	if (!body.name || !body.number) {
		return response.status(400).json({ error: "missing data" });
	}
	Person.findOne({ name: body.name })
		.then((existingPerson) => {
			if (existingPerson) {
				existingPerson.number = body.number;
				return existingPerson.save().then((updatedPerson) => {
					response.status(200).json({
						message: "Person updated",
						person: updatedPerson,
					});
				});
			} else {
				const person = new Person({
					name: body.name,
					number: body.number,
				});
				return person.save().then((savedPerson) => {
					response.status(201).json({
						message: "Person created",
						person: savedPerson,
					});
				});
			}
		})
		.catch((error) => {
			response.status(500).json({ error: error.message });
		});
});

app.get("/info", (request, response) => {
	Person.countDocuments()
		.then((count) => {
			const time = new Date();
			const result = `
		<p>Phonebook has info for ${count} people</p>
		<p>${time.toString()}</p>
		`;
			response.send(result);
		})
		.catch((error) => next(error));
});

const errorHandler = (error, request, response, next) => {
	console.error(error.message);
	if (error.name === "CastError") {
		return response.status(400).send({ error: "malformatted id" });
	}
	next(error);
};
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
	console.log(`listening on port, ${PORT}`);
});
