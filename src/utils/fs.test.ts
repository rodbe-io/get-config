import { describe, expect, it } from 'vitest';

import { readJsonFile } from './fs';

describe('readJsonFile', () => {
  it('should read file with empty file', () => {
    const filePath = `${process.cwd()}/empty.json`;
    const result = readJsonFile(filePath);

    console.log(result);
    expect(result).toEqual(null);
  });
});

describe('readJsonFile', () => {
  it('should read prop name from package.json', () => {
    const filePath = `${process.cwd()}/package.json`;
    const result = readJsonFile<Record<string, unknown>>(filePath);

    expect(result?.name).toBe('@rodbe/get-config');
  });
});
