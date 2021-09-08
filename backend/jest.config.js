/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  globals: {
    'ts-jest': {
      useESM: true,
    },
  },
  preset: 'ts-jest/presets/js-with-ts-esm',
  testEnvironment: 'node',
};
