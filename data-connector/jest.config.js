module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: [
    "<rootDir>/test/", // This tells Jest to look for tests in the 'src' directory. Adjust if your tests are located elsewhere.
  ],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(ts|tsx|js)$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
};
