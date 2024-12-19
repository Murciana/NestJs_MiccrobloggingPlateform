const path = require('path');

module.exports = {
    preset: 'ts-jest',
    testEnvironment: path.join(
        __dirname,
        'prisma',
        'prisma-test-environment.js',
    ), moduleNameMapper: {
        '^@prisma/client$': '<rootDir>/node_modules/@prisma/client',
      },
    setupFilesAfterEnv: [],
    // setupFilesAfterEnv: ['<rootDir>/setupTests.ts'],
};
