import _ = require('lodash');
import chalk = require('chalk');
import * as glob from 'glob';
import * as fs from 'fs';
import * as path from 'path';
import { getGlobbedPaths } from '../tools/utils';

export class Config {

  private static _instance: Config = new Config();

  private VERSION = '0.0.1';
  private config: any = {};

  public static getInstance(): Config {
    return Config._instance;
  }

  constructor() {
    if (Config._instance) {
      throw new Error('Error: Instantiation failed: Use Config.getInstance() instead of new.');
    }
    this.config = this.initGlobalConfig();
    Config._instance = this;
  }

  public getConfig() {
    return this.config;
  }

  private initVersion(config: any) {
    config.baymax = { 'version': this.VERSION };
  };

  /**
   * Validate NODE_ENV existence
   */
  private validateEnvironmentVariable() {
    let environmentFiles = glob.sync('./config/env/' + process.env.NODE_ENV + '.js');
    console.log();
    if (!environmentFiles.length) {
      if (process.env.NODE_ENV) {
        console.error(chalk.red(
          '+ Error: No configuration file found for "'
          + process.env.NODE_ENV
          + '"environment using development instead'));
      } else {
        console.error(chalk.red('+ Error: NODE_ENV is not defined! Using default development environment'));
      }
      process.env.NODE_ENV = 'development';
    }
    // Reset console color
    console.log(chalk.white(''));
  };

  /**
   * Validate Secure=true parameter can actually be turned on
   * because it requires certs and key files to be available
   */
  private validateSecureMode(config: any): boolean {

    if (!config.secure || config.secure.ssl !== true) {
      return true;
    }

    let privateKey = fs.existsSync(path.resolve(config.secure.privateKey));
    let certificate = fs.existsSync(path.resolve(config.secure.certificate));

    if (!privateKey || !certificate) {
      console.log(chalk.red('+ Error: Certificate file or key file is missing, falling back to non-SSL mode'));
      console.log(chalk.red('  To create them, simply run the following from your shell: sh ./scripts/generate-ssl-certs.sh'));
      console.log();
      config.secure.ssl = false;
      return false;
    } else {
      return true;
    }
  };

  /**
   * Validate Session Secret parameter is not set to default in production
   */
  private validateSessionSecret(config: any, testing: boolean) {

    if (process.env.NODE_ENV !== 'production') {
      return true;
    }

    if (config.sessionSecret === 'Baymax') {
      if (!testing) {
        console.log(chalk.red('+ WARNING: It is strongly recommended that you change sessionSecret config while running in production!'));
        console.log(chalk.red('  Please add `sessionSecret: process.env.SESSION_SECRET || \'super amazing secret\'` to '));
        console.log(chalk.red('  `config/env/production.js` or `config/env/local.js`'));
        console.log();
      }
      return false;
    } else {
      return true;
    }
  };

  /**
   * Initialize global configuration files
   */
  private initGlobalConfigFiles(config: any, assets: any) {
    // Appending files
    config.files = {
      server: {},
      client: {}
    };

    // Setting Globbed model files
    config.files.server.mdmodels = getGlobbedPaths(assets.server.mdmodels, []);
    config.files.server.pgmodels = getGlobbedPaths(assets.server.pgmodels, []);

    // Setting Globbed route files
    config.files.server.routes = getGlobbedPaths(assets.server.routes, []);

    // Setting Globbed config files
    config.files.server.configs = getGlobbedPaths(assets.server.config, []);

    // Setting Globbed socket files
    config.files.server.sockets = getGlobbedPaths(assets.server.sockets, []);

    // Setting Globbed policies files
    config.files.server.policies = getGlobbedPaths(assets.server.policies, []);

    // Setting Globbed js files
    config.files.client.js = getGlobbedPaths(assets.client.lib.js, 'client/')
      .concat(getGlobbedPaths(assets.client.js, ['client/']));

    // Setting Globbed css files
    config.files.client.css = getGlobbedPaths(assets.client.lib.css, 'client/')
      .concat(getGlobbedPaths(assets.client.css, ['client/']));

    // Setting Globbed test files
    config.files.client.tests = getGlobbedPaths(assets.client.tests, []);
  };

  /**
  * Initialize global configuration
  */
  public initGlobalConfig() {
    // Validate NODE_ENV existence
    this.validateEnvironmentVariable();

    // Get the base assets
    let baseAssets = require(path.join(process.cwd(), 'config/assets/base'));

    // Get the current assets
    let environmentAssets = require(path.join(process.cwd(), 'config/assets/', process.env.NODE_ENV)) || {};

    // Merge assets
    let assets = _.merge(baseAssets, environmentAssets);

    // Get the base config
    let baseConfig = require(path.join(process.cwd(), 'config/env/base'));

    // Get the current config
    let environmentConfig = require(path.join(process.cwd(), 'config/env/', process.env.NODE_ENV)) || {};

    // Merge config files
    let config = _.merge(baseConfig, environmentConfig);

    // read package.json for Baymax project information
    // let pkg = require(path.resolve('./package.json'));
    // config.baymax = pkg;
    this.initVersion(config);

    // Extend the config object with the local-NODE_ENV.js custom/local environment.
    // This will override any settings present in the local configuration.
    config = _.merge(
      config,
      (fs.existsSync(path.join(process.cwd(), 'config/env/local-' + process.env.NODE_ENV + '.js'))
        && require(path.join(process.cwd(), 'config/env/local-' + process.env.NODE_ENV + '.js'))) || {});

    // Initialize global globbed files
    this.initGlobalConfigFiles(config, assets);

    // Validate Secure SSL mode can be used
    this.validateSecureMode(config);

    // Validate session secret
    this.validateSessionSecret(config, false);

    return config;
  };
};
