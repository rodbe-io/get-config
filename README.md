# 🧝‍♂️ Search and load configuration for your program 🪄

## Overview

- The `getConfig('myModuleName')` func is designed to search and load configuration for your module.
- The `getCoreConfig('myModuleName')` searches for your configuration. This returns:
  - If the module's configuration is located in `package.json`, the func returns an object containing:
    - `config`: The configuration object for the module.
    - `configFrom`: A string `'PACKAGE_JSON'` indicating that the configuration was sourced from package.json.
    - `configPath`: The file path to `package.json`.

  - If the configuration is found in a separate file, it returns an object containing:
    - `configFrom`: A string `'CONFIG_FILE'` indicating that the configuration was sourced from a standalone file.
    - `configPath`: The file path to the configuration file.


## Supported Configuration File Formats (order matters)

| File name                  | Language | Example using "myapp"        |
|----------------------------|----------|------------------------------|
| package.json               | json     | "myapp" prop in package.json |
| .{MyModuleName}rc          | json     | .myapprc                     |
| .{MyModuleName}rc.json     | json     | .myapprc.json                |
| .{MyModuleName}rc.js       | es6      | .myapprc.js                  |
| .{MyModuleName}rc.mjs      | es6      | .mypapprc.mjs                |
| .{MyModuleName}rc.cjs      | commonjs | .myapprc.cjs                 |
| {MyModuleName}.config.json | json     | myapp.config.json            |
| {MyModuleName}.config.js   | es6      | myapp.config.js              |
| {MyModuleName}.config.mjs  | es6      | myapp.config.mjs             |
| {MyModuleName}.config.cjs  | commonjs | myapp.config.cjs             |

## Usage

```typescript
import { getConfig } from '@rodbe/get-config';

// Example: Getting the configuration for a module named 'myawesomeapp'
async function loadConfig() {
  const config = await getConfig<{ [key: string]: any }>('myawesomeapp', { debug: true });

  if (config) {
    console.log('Configuration:', config); // prints your configuration object
  } else {
    console.log('No configuration file found.');
  }
}

loadConfig();
```
or
```ts
import { getConfigCore } from '@rodbe/get-config';

async function loadConfig() {
  const config = await getConfigCore<{ [key: string]: any }>('myawesomeapp', { debug: true });

  console.log('Configuration origin:', config);
  /** Config from package.json, prints:
    {
      config: { myPropConfig: ['some value'], otherProp: true, do: 're-mi' },
      configFrom: 'PACKAGE_JSON',
      configPath: '/Users/my-pc-user/projects/my-project/package.json'
    }
  */
 /** Config from any file (explained above), prints:
    {
      configFrom: 'CONFIG_FILE',
      configPath: '/Users/my-pc-user/projects/my-project/myawesomeapp.config.js'
    }
  */
}

loadConfig();

```

## Options

- `debug`: A boolean option. When `true`, prints the directory path being searched to the console for debugging purposes.
