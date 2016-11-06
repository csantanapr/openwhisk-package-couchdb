// jshint esversion: 6

var nano = require('nano');
var request = require('request');

function main({
  mgmtdbUrl: mgmtdbUrl = 'http://localhost:5498',
  mgmtdbName: mgmtdbName = 'triggers',
  loop: loop = false,
  action: action = 'provider',
  package: package = 'couchdb',
  namespace: namespace = '_'
}) {
  try {
    var triggersDB = nano(mgmtdbUrl).use(mgmtdbName);
    return new Promise(function (resolve, reject) {
      triggersDB.list({ include_docs: true }, function (err, body) {
        if (!err) {
          console.log(`triggers found: ${body.rows.length}`);
          Promise.all(body.rows.map(function (trigger) {
            return new Promise(function (resolve, reject) {
              nano(trigger.doc.dbUrl).db.changes(trigger.doc.dbName, {
                since: trigger.doc.since,
                include_docs: trigger.doc.include_docs,
                filter: trigger.doc.filter
              }, function (err, body) {
                console.log('returning from changes', body.results.length);
                if (!err) {
                  //console.log(body);
                  trigger.doc.since = body.last_seq;
                  triggersDB.insert(trigger.doc, function (err, body2) {
                    if (body && body.results && body.results.length && body.results.length > 0) {
                      //handleChanges(body, trigger.id, trigger.doc.include_docs, resolve2);
                      console.log(`Firing trigger ${trigger.id}`);
                      request.post({
                        url: trigger.id,
                        headers: {
                          'Content-Type': 'application/json'
                        },
                        json: body,
                      }, (error, response, body) => {
                        if (!error && response.statusCode >= 200 && response.statusCode < 400) {
                          console.log(body) // trigger fired
                        } else {
                          console.error('errors firing trigger');
                        }
                        resolve();
                      });
                    } else {
                      console.log(`no changes for dbName: ${trigger.doc.dbName}`);
                      resolve();
                    }
                  });
                } else {
                  resolve();
                }
              });
            });
          })).then(function (changes) {
            console.log("done checking all changes");
            if (loop && whisk && whisk.invoke) {
              whisk.invoke({
                name: `/${namespace}/${package}/${action}`
              }).then((result) => {
                console.log("whisk.invoke result", result);
                resolve({ changes: changes });
              }).catch((error) => {
                console.log("whisk.invoke error", error);
                reject(error);
              });
            } else {
              resolve({ changes: changes });
            }
          }).catch((error) => {
            console.error("something very bad happened");
          });
        }
      });
    });
  } catch (e) {
    console.error(JSON.stringify(e));
    if (loop && whisk && whisk.invoke) {
      return whisk.invoke({
        name: `/${namespace}/${package}/${action}`
      });
    } else {
      return Promise.reject(e);
    }
  }
}


if (require.main !== module) {
  module.exports = main;
}