const mongoose = require('mongoose');
const env = require('./environment');

//warning supress
mongoose.set('strictQuery', false);

//connect to db
mongoose.connect(`mongodb://127.0.0.1:27017/${env.db}`);

//connection establish
const db = mongoose.connection;

//incase of error
db.on('error', console.log.bind(console, "Error connecting to db"));

//connected
db.once('open', function () {
    console.log("Connected to MongoDB");
});

module.exports = db;