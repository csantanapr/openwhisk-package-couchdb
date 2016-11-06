require('dotenv').config();

var DB_URL = process.env.DB_URL;

var nano = require('nano')(DB_URL);

nano.db.list(function(err, body) {
  // body is an array
  body.forEach(function(db) {
    console.log(db);
  });
});