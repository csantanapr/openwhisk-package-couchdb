#!/bin/bash

set -e

source .env

./uninstall.sh

wsk package create couchdb 
wsk action create couchdb/changes feed/changes.js -p mgmtdbUrl ${DB_URL} -p mgmtdbName ${DB_NAME_TRIGGERS} -p endpoint $(wsk property get --apihost | awk '{printf $4}')
wsk action create couchdb/provider feed/provider.js -p mgmtdbUrl ${DB_URL} -p mgmtdbName ${DB_NAME_TRIGGERS} -t 300000 -m 512 -p namespace $(wsk property get --namespace | awk '{printf $3}')
