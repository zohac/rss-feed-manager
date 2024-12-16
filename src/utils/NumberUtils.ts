// src/utils/NumberUtils.ts

import { NotANumberException } from '../application/exception/NotANumberException';

export class NumberUtils {
  static isNumber(value: any): boolean {
    return typeof value === 'number' && Number.isFinite(value);
  }

  static validateNumber(value: any): boolean {
    if (NumberUtils.isNumber(value)) return true;

    throw new NotANumberException('Invalid value');
  }
}
