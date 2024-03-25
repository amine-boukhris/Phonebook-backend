const mongoose = require("mongoose");

// make connection
const url = process.env.MONGODB_URI;
mongoose.set("strictQuery", false);
console.log("connection to,", url);
mongoose
	.connect(url)
	.then((result) => {
		console.log("connected to MongoDB");
	})
	.catch((error) => {
		console.log("error connecting to MongoDB:", error.message);
	});

// define schema
const personSchema = new mongoose.Schema({
	name: String,
	number: String,
});

// set the return format of the model when transforming it to JSON
personSchema.set("toJSON", {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
	},
});

// export model
module.exports = mongoose.model("Person", personSchema);
