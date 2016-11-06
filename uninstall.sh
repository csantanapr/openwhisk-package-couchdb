#!/bin/bash

wsk action delete couchdb/changes
wsk action delete couchdb/provider
wsk package delete couchdb
