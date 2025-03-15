import { readFileSync } from 'node:fs';

import { tryCatch } from '@rodbe/fn-utils';

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
export const readJsonFile = <T extends object>(filePath: string) => {
  const [err, file] = tryCatch<string>(() => readFileSync(filePath, 'utf8'));

  if (err) {
    return null;
  }

  const [errParse, jsonFile] = tryCatch<T>(() => JSON.parse(file) as T);

  if (errParse) {
    return null;
  }

  return jsonFile;
};
