import { composePlugins, withNx } from '@nx/webpack';
const ForkTsCheckerWebpackPlugin: typeof import('fork-ts-checker-webpack-plugin') = require('fork-ts-checker-webpack-plugin');
import { resolve } from 'node:path';
import { withReact } from '@nx/react';
import { withModuleFederation } from '@nx/module-federation/webpack.js';
import { ModuleFederationConfig } from '@nx/module-federation';

import baseConfig from './module-federation.config';

const config: ModuleFederationConfig = {
  ...baseConfig,
};

// Nx plugins for webpack to build config object from Nx options and context.
/**
 * DTS Plugin is disabled in Nx Workspaces as Nx already provides Typing support for Module Federation
 * The DTS Plugin can be enabled by setting dts: true
 * Learn more about the DTS Plugin here: https://module-federation.io/configure/dts.html
 */
export default composePlugins(
  withNx(),
  withReact(),
  withModuleFederation(config, { dts: false }),
  (webpackConfig) => {
    // Keep declarations of referenced libraries up to date while serving.
    webpackConfig.plugins = webpackConfig.plugins?.map((plugin) =>
      plugin instanceof ForkTsCheckerWebpackPlugin
        ? new ForkTsCheckerWebpackPlugin({
            typescript: {
              configFile: resolve(__dirname, 'tsconfig.app.json'),
              build: true,
              mode: 'write-references',
            },
          })
        : plugin,
    );
    return webpackConfig;
  },
);
