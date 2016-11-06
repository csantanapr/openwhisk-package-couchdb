require('dotenv').config();

var DB_URL = process.env.DB_URL;

var nano = require('nano')(DB_URL);

var triggers = nano.use('triggers');

triggers.list({include_docs: true},function(err, body) {
  if (!err) {
    body.rows.forEach(function(doc) {
      console.log(doc);
    });
    console.log(`triggers found: ${body.rows.length}`);
  }
});