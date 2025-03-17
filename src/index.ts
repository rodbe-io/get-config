import { extname, join, parse } from 'node:path';
import { existsSync } from 'node:fs';

import { to } from '@rodbe/fn-utils';

import { readJsonFile } from '@/utils/fs';

interface Options {
  debug?: boolean;
}

const CONFIG_FILES = (moduleName: string) => [
  `.${moduleName}rc`,
  `.${moduleName}rc.json`,
  `.${moduleName}rc.js`,
  `.${moduleName}rc.mjs`,
  `.${moduleName}rc.cjs`,
  `${moduleName}.config.json`,
  `${moduleName}.config.js`,
  `${moduleName}.config.mjs`,
  `${moduleName}.config.cjs`,
];

const getConfigPkgJsonPath = (moduleName: string): string | null => {
  const cwd = process.cwd();
  let currentPath = cwd;
  let configPkgJsonPath = null;
  const { root } = parse(cwd);

  while (currentPath !== root) {
    const pkgJsonPath = join(currentPath, 'package.json');

    if (existsSync(pkgJsonPath)) {
      const pkgJson = readJsonFile<Record<string, string>>(pkgJsonPath);

      if (pkgJson?.[moduleName]) {
        configPkgJsonPath = pkgJsonPath;
        break;
      }
    }

    currentPath = join(currentPath, '..');
  }

  return configPkgJsonPath;
};

const getConfigFilePath = (moduleName: string, opts?: Options): string | null => {
  const cwd = process.cwd();
  let currentPath = cwd;
  let configFileName = '';
  const { root } = parse(cwd);

  while (currentPath !== root) {
    const foundConfigFileName = CONFIG_FILES(moduleName).find((file) =>
      existsSync(join(currentPath, file))
    );

    if (foundConfigFileName) {
      configFileName = foundConfigFileName;
      break;
    }

    currentPath = join(currentPath, '..');
  }

  if (opts?.debug) {
    console.log('debug:', currentPath);
  }

  if (!configFileName) {
    return null;
  }

  return join(currentPath, configFileName);
};

export const getCoreConfig = (moduleName: string, argv?: Options) => {
  const pkgJsonPath = getConfigPkgJsonPath(moduleName);
  const configFilePath = getConfigFilePath(moduleName, argv);

  if (pkgJsonPath) {
    const pkgJson = readJsonFile<Record<string, string>>(pkgJsonPath);

    return {
      config: pkgJson?.[moduleName],
      configFrom: 'PACKAGE_JSON',
      configPath: pkgJsonPath,
    } as const;
  }

  return {
    configFrom: `CONFIG_FILE`,
    configPath: configFilePath,
  } as const;
};

export const getConfig = async <T>(moduleName: string, opts: Options): Promise<T | null> => {
  const { configFrom, configPath, config } = getCoreConfig(moduleName, opts);

  if (configFrom === 'PACKAGE_JSON') {
    return Promise.resolve(config as T);
  }

  if (!configPath) {
    return null;
  }

  const extFile = extname(configPath);

  if (['.js', '.mjs'].includes(extFile)) {
    const [err, config] = await to(import(configPath), {
      msg: `${configPath} module is not defined as ES module. Exports an object using export default`,
    });

    if (err) {
      console.log(err.msg);

      return null;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
    return config.default;
  }
  if (['.cjs'].includes(extFile)) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require(configPath) as T;
  }

  return readJsonFile(configPath) as T;
};
