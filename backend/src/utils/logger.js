const fs = require('fs');
const path = require('path');

const logDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const logger = {
  info: (message, meta = {}) => {
    const log = { level: 'INFO', timestamp: new Date().toISOString(), message, ...meta };
    console.log(JSON.stringify(log));
    fs.appendFileSync(path.join(logDir, 'app.log'), JSON.stringify(log) + '\n');
  },
  error: (message, error = {}) => {
    const log = { level: 'ERROR', timestamp: new Date().toISOString(), message, error: error.message, stack: error.stack };
    console.error(JSON.stringify(log));
    fs.appendFileSync(path.join(logDir, 'error.log'), JSON.stringify(log) + '\n');
  },
  warn: (message, meta = {}) => {
    const log = { level: 'WARN', timestamp: new Date().toISOString(), message, ...meta };
    console.warn(JSON.stringify(log));
    fs.appendFileSync(path.join(logDir, 'app.log'), JSON.stringify(log) + '\n');
  }
};

module.exports = logger;
