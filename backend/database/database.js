const mongoose = require('mongoose');
require('dotenv').config();

const url = process.env.MONGO_DB_URL;

const db = mongoose.connect(url)
  .then(() => console.log("Database connected"))
  .catch(err => console.error("Error connecting to database", err));

module.exports = db.connection;
