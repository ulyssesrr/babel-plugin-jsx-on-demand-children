module.exports = {
  transform: {
    "^.+\\.js?$": [
      "esbuild-jest",
      {
        target: 'node10.4'
      }
    ]
  },
};