require('dotenv').config();

var DB_URL = process.env.DB_URL;
var nano = require('nano')(DB_URL);
var db_prefix = 'customers';


for (var i = 0; i < 200; i++) {
  setTimeout(function (i) {
    // clean up the database we created previously
    nano.db.destroy(`${db_prefix}_${i}`, function () {
      // create a new database
      console.log(`creating ${db_prefix}_${i}`);
      nano.db.create(`${db_prefix}_${i}`, function () {
      });
    });
  }, 100*i, i);
}



