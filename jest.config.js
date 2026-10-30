/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: "node",
  testMatch: ["<rootDir>/lib/**/*.test.ts"],
  transform: {
    "^.+\\.ts$": ["ts-jest", { tsconfig: { module: "commonjs", esModuleInterop: true } }],
  },
  moduleNameMapper: { "^@/(.*)$": "<rootDir>/$1" },
};
