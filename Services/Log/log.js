const winston = require('winston');

const logger = winston.createLogger({
  level: 'info', 
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }), 
    winston.format.json() 
  ),
  transports: [
  
    new winston.transports.File({ 
      filename: 'logs/app.log',
      maxsize: 100000000,
      tailable: true     
    }),
  ],
});

// 3. Output to console only if NOT in production
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    ),
  }));
}

module.exports = logger;