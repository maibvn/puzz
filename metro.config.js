const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Fix for SHA-1 computation issues
config.resolver.platforms = ["ios", "android", "native", "web"];

// Ensure proper cache handling
config.transformer.minifierConfig = {
  keep_fnames: true,
  mangle: {
    keep_fnames: true,
  },
};

// Fix watchman symlink issues and disable file watcher
config.watchFolders = [];
config.resolver.symlinks = false;

// Force disable file watcher to fix SHA-1 issues
config.watcher = {
  additionalExts: ["cjs", "mjs"],
  watchman: {
    deferStates: ["hg.update"],
  },
  unstable_lazySha1: false,
  unstable_autoSaveCache: {
    enabled: false,
  },
};

// Alternative: Disable watcher entirely for development
config.server = {
  enhanceMiddleware: (middleware) => {
    return (req, res, next) => {
      // Disable caching for development
      res.setHeader("Cache-Control", "no-store");
      return middleware(req, res, next);
    };
  },
};

module.exports = config;
