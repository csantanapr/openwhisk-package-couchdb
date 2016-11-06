#!/bin/bash

set -e

source .env

wsk package create couchdb
wsk action update couchdb/changes feed/changes.js -p mgmtdbUrl ${DB_URL} -p mgmtdbName ${DB_NAME_TRIGGERS}
wsk action update couchdb/provider feed/provider.js -p mgmtdbUrl ${DB_URL} -p mgmtdbName ${DB_NAME_TRIGGERS}
