module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.ts?$": "ts-jest",
  },
  transformIgnorePatterns: ["<rootDir>/node_modules/"],
  testPathIgnorePatterns: [
    "e2e/specs/base.spec.ts", // Игнорирует конкретный файл base.spec.ts
  ],
};
