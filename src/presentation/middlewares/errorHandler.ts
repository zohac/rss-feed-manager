import { Request, Response, NextFunction } from 'express';

import logger from '../../infrastructure/logger/logger';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  logger.error(err.stack);

  switch (err.name) {
    case 'NotFoundException':
      res
        .status(404)
        .json({ message: 'Resource not found', error: err.message });
      break;

    default:
      res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};
