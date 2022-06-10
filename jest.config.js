module.exports = {
  clearMocks: true,
  moduleFileExtensions: ['js', 'ts'],
  testMatch: ['**/*.test.ts'],
  transform: {
    "\\.jsx?$": "babel-jest",
    "\\.tsx?$": "ts-jest"
  },
  transformIgnorePatterns: [
    "/node_modules/(?!markdown-table).+\\.js",
  ],
  verbose: true
}
