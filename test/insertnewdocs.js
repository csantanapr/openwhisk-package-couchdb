// jshint esversion: 6
require('dotenv').config();

var DB_URL = process.env.DB_URL;
var nano = require('nano')(DB_URL);
var db_prefix = 'customers';
for (var i = 0; i < 2; i++) {
  createDoc(nano.use(`${db_prefix}_${i}`));
}

function createDoc(db) {
  for (var i = 0; i < 3; i++) {
    setTimeout(function () {
      db.insert({
        foo: new Date().toDateString(),
      }, function (err, body, header) {
        if (!err) {
          console.log('you have inserted a new doc');
        }
      });
    }, 100 * i);
  }

}