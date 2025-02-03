module.exports = {
  webpack: {
    configure: {
      resolve: {
        fallback: {
          "zlib": require.resolve("browserify-zlib"),
          "stream": require.resolve("stream-browserify"),
          "crypto": require.resolve("crypto-browserify"),
          "http": require.resolve("stream-http"),
          "https": require.resolve("https-browserify"),
          "assert": require.resolve("assert/"),
          "buffer": require.resolve("buffer/"),
          "process": require.resolve("process/browser"),
          "util": require.resolve("util/"),
        },
      },
      plugins: [
        new (require("webpack")).ProvidePlugin({
          process: "process/browser",
          Buffer: ["buffer", "Buffer"],
        }),
      ],
    },
  },
};

