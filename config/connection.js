const mysql = require("mysql2");

require('dotenv').config()

// Connect to database
const connection = mysql.createConnection(
  {
    host: "localhost",
    // Your MySQL username
    database: "employees",
    user: "root",
    // Your MySQL password
    password: "root"
  },
  console.log("Connected to the database.")
);

module.exports = connection;