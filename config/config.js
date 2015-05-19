var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'express'
    },
    port: 3000,
    db: 'sqlite://localhost/express-development',
    storage: rootPath + '/data/express-development'
  },

  test: {
    root: rootPath,
    app: {
      name: 'express'
    },
    port: 3000,
    db: 'sqlite://localhost/express-test',
    storage: rootPath + '/data/express-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'express'
    },
    port: 3000,
    db: 'sqlite://localhost/express-production',
    storage: rootPath + 'data/express-production'
  }
};

module.exports = config[env];
