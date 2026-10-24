import { BadRequestException } from '@nestjs/common';
import { ParseStatusPipe } from './parse-status.pipe.js';

describe('ParseStatusPipe', () => {
  let pipe: ParseStatusPipe;

  beforeEach(() => {
    pipe = new ParseStatusPipe();
  });

  it('transforms a valid status to uppercase', () => {
    expect(pipe.transform('done', {} as any)).toBe('DONE');
  });

  it('throws BadRequestException for an invalid status', () => {
    expect(() => pipe.transform('whatever', {} as any)).toThrow(BadRequestException);
  });
});