import { Request, Response, NextFunction } from 'express';

import logger from '../../infrastructure/logger/logger';

export function routeNotFound(req: Request, res: Response, next: NextFunction) {
  const error = new Error('Route not found');
  logger.warn(error);

  return res.status(404).json({
    error: {
      message: error.message,
    },
  });
}
