import { LoggerLevel } from '../enum/LoggerLevel';

const winston = require('winston');

export class Logger {

    public static log(message: string, level: LoggerLevel = LoggerLevel.INFO): void {
        const logConfiguration: any = {
            'transports': [
                new winston.transports.Console({
                    format: winston.format.colorize({ all: true }),
                }),
                new winston.transports.File({ 
                    filename: 'log/error.log',
                    level: 'error'
                }),
                new winston.transports.File({
                    filename: 'log/combined.log',
                }),
            ]
        };
        
        const logger: any = winston.createLogger(logConfiguration);
        
        logger.log(level, {
            message: message,
        })    
    }
}
