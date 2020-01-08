module.exports = {
  collectCoverageFrom: ['<rootDir>/src/'],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testRegex: '(/tests/.*|\\.(test|spec))\\.(ts|tsx|js|jsx)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  testPathIgnorePatterns: [
    '<rootDir>/tests/helpers/',
    '<rootDir>/tests/__mocks__/',
  ],
  roots: ['<rootDir>', '<rootDir>/tests/'],
};
