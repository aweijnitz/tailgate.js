#!/bin/bash

# Start server and save pid for later.
node ./testServer.js &
PID=$!

casperjs test ./testCases/testBasics.js

# Stop server
kill $PID
