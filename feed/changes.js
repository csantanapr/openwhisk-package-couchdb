// jshint esversion: 6

var nano = require('nano');

function main({
  lifecycleEvent: lifecycleEvent,
  triggerName: triggerName,
  dbUrl: dbUrl,
  dbName: dbName,
  since: since = 'now',
  include_docs: include_docs = false,
  filter: filter,
  mgmtdbUrl: mgmtdbUrl = 'http://localhost:5498',
  mgmtdbName: mgmtdbName = 'triggers',
  authKey: authKey,
  endpoint: endpoint
}) {
  triggerName = triggerName.split("/");
  var triggerUrl = 'https://' + authKey + "@" + endpoint + '/api/v1/namespaces/' + encodeURIComponent(triggerName[1]) + '/triggers/' + encodeURIComponent(triggerName[2]);
  var promise;
  var db = nano(mgmtdbUrl).db.use(mgmtdbName);

  if (lifecycleEvent === 'CREATE') {
    promise = new Promise((resolve, reject) => {
      db.insert({
        dbUrl: dbUrl,
        dbName: dbName,
        since: since,
        include_docs: include_docs,
        filter: filter
      }, triggerUrl, (err, body) => {
        if (!err) {
          console.log('success ', body);
          resolve({ response: body });
        } else {
          console.error('error ', err);
          reject(err);
        }
      });
    });
  } else if (lifecycleEvent === 'DELETE') {
    promise = new Promise((resolve, reject) => {
      db.get(triggerUrl, (err, doc)=>{
        if(!err){
          db.destroy(doc._id,doc._rev,(err, body)=>{
            if(!err){
              console.log('success ', body);
              resolve({ response: body });
            } else {
              console.error('error ', err);
              reject(err);
            }
          });
        } else {
          console.error('error ', err);
          reject(err);
        }
      });
    });
  }
  return promise;
}

if (require.main !== module) {
  module.exports = main;
}


