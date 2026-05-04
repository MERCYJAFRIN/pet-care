const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const logFile = path.join(__dirname, 'server_runtime.log');
const out = fs.openSync(logFile, 'a');
const err = fs.openSync(logFile, 'a');

fs.writeSync(out, `--- Server Start Attempt at ${new Date().toISOString()} ---\n`);

const server = spawn('node', ['src/server.js'], {
    detached: true,
    stdio: ['ignore', out, err]
});

server.unref();

console.log(`Server started with PID: ${server.pid}. Logging to ${logFile}`);
process.exit(0);
