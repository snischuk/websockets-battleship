import { Buffer } from 'node:buffer';
import type { RawData } from 'ws';

export const rawDataToString = (raw: RawData): string => {
  switch (true) {
    case typeof raw === 'string':
      return raw;
    case Buffer.isBuffer(raw):
      return raw.toString('utf-8');
    case raw instanceof ArrayBuffer:
      return Buffer.from(raw).toString('utf-8');
    case Array.isArray(raw):
      return Buffer.concat(raw).toString('utf-8');
    default:
      return '';
  }
};
