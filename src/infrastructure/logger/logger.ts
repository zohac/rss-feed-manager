// src/infrastructure/logger/logger.ts
import path from 'path';

import {
  createLogger,
  format,
  transports,
  Logger as WinstonLogger,
} from 'winston';

import { config } from '../config/config';

// Définir le format des logs
const logFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.errors({ stack: true }), // Inclure les stacks des erreurs
  format.splat(),
  format.json(),
  format.prettyPrint(),
);

// Créer le logger Winston
const logger: WinstonLogger = createLogger({
  level: config.logger.level, // Niveau de log défini dans la config
  format: logFormat,
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.printf(({ timestamp, level, message, stack }) => {
          return stack
            ? `${timestamp} [${level}]: ${message} - ${stack}`
            : `${timestamp} [${level}]: ${message}`;
        }),
      ),
    }),
    // Ajouter un transport pour les fichiers de log
    new transports.File({
      filename: path.join('logs', 'error.log'),
      level: 'error',
    }),
    new transports.File({ filename: path.join('logs', 'combined.log') }),
  ],
  exceptionHandlers: [
    new transports.File({ filename: path.join('logs', 'exceptions.log') }),
  ],
  rejectionHandlers: [
    new transports.File({ filename: path.join('logs', 'rejections.log') }),
  ],
});

export default logger;
