// jshint esversion: 6
require('dotenv').config();

var DB_URL = process.env.DB_URL;
var WSKAUTH = process.env.WSKAUTH;
var WSKHOST = process.env.WSKHOST;

var action = require('./changes.js');
var lifecycleEvent = process.argv[3] ? process.argv[3] : 'CREATE';

action(
  {
    mgmtdbUrl: DB_URL,
    mgmtdbName: 'triggers',
    lifecycleEvent: lifecycleEvent,
    triggerName: '/csantana@us.ibm.com_demo/mytrigger2',
    dbUrl: DB_URL,
    dbName: 'customers_0',
    authKey: WSKAUTH,
    endpoint: WSKHOST
  }
).then(function () {
  console.log("test poc done");
}).catch(function () {
  console.error("Something bad happened");
});
