// jshint esversion: 6
require('dotenv').config();

var DB_URL = process.env.DB_URL;

var action = require('./provider.js');

action({dbUrl:DB_URL,dbName:'triggers'})
.then(function(changes){
  console.log("test poc done");
  console.log(changes);
}).catch(function(){
  console.error("Something bad happened");
});


