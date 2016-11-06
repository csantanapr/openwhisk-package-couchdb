// jshint esversion: 6
require('dotenv').config();

var DB_URL = process.env.DB_URL;
var nano = require('nano')(DB_URL);
var db_prefix = 'customers';

// clean up the database we created previously
nano.db.destroy('triggers', function () {
  // create a new database
  nano.db.create('triggers', function () {
    // specify the database we are going to use
    var triggers = nano.use('triggers');
    // and insert a document in it
    for (var i = 0; i < 0; i++) {
      createtrigger(triggers, i);
    }
  });
});
function createtrigger(db, i) {
  setTimeout(function () {
    var dbName = `${db_prefix}_${i}`;
    db.insert({
      dbUrl: DB_URL,
      dbName: dbName,
      since: 'now'
    }, `https://user:pass@openwhisk.ng.bluemix.net/trigger_${i}`,
      function (err, body, header) {
        if (err) {
          console.log('[triggers.insert] ', err.message);
          return;
        }
        console.log('you have inserted the trigger')
        console.log(body);
      });
  }, 100 * i);
}