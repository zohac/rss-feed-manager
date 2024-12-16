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
    case 'NotANumberException':
    case 'ValidationException':
      return res
        .status(400)
        .json({ message: 'Bad Request', error: err.message });

    case 'NotFoundException':
      return res
        .status(404)
        .json({ message: 'Resource not found', error: err.message });

    default:
      return res
        .status(500)
        .json({ message: 'Erreur serveur', error: err.message });
  }
};
