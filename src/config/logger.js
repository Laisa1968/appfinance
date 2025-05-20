const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    // Log para console
    new winston.transports.Console(),
    // Log de erros para arquivo
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    // Log geral para arquivo
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

module.exports = logger;