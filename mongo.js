const mongoose = require("mongoose");

if (process.argv.length < 3) {
	console.log("provide password as an argument");
	process.exit(1);
}
const password = process.argv[2];
const url = `mongodb+srv://boukhrisamine210:${password}@fullstackcluster.3eesyqu.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=fullstackCluster`;
mongoose.set("strictQuery", false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
	name: String,
	number: String,
});

const Person = mongoose.model("Person", personSchema);

const getPersons = () => {
	Person.find().then((result) => {
		console.log("phonebook:");
		result.forEach((person) => {
			console.log(person.name, person.number);
		});
		mongoose.connection.close();
	});
};

const createPerson = (name, number) => {
	const person = new Person({
		name: name,
		number: number,
	});
	person.save().then((result) => {
		console.log("result:", result);
		mongoose.connection.close();
	});
};

if (process.argv.length === 3) {
	getPersons();
} else if (process.argv.length === 5) {
	const name = process.argv[3];
	const number = process.argv[4];
	createPerson(name, number);
} else {
	console.log(
		"command expect either 1 or 3 arguments - provided arguments doesn't match"
	);
	process.exit(1);
}
