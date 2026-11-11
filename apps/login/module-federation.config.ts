import { ModuleFederationConfig } from '@nx/module-federation';

const config: ModuleFederationConfig = {
  name: 'login',
  // Keep React bound to the singleton already loaded by the shell.
  disableNxRuntimeLibraryControlPlugin: true,
  library: { type: 'var', name: 'login' },
  exposes: {
    './Module': './src/remote-entry.ts',
  },
  shared: (libraryName, sharedConfig) => {
    const sharedLibraries = [
      'react',
      'react-dom',
      'react/jsx-runtime',
      'react/jsx-dev-runtime',
      'react-dom/client',
      '@react-storefront-architecture/auth',
    ];

    if (sharedLibraries.includes(libraryName)) {
      return {
        ...sharedConfig,
        singleton: true,
        strictVersion: false,
        requiredVersion: false,
      };
    }

    return sharedConfig;
  },
};

/**
 * Nx requires a default export of the config to allow correct resolution of the module federation graph.
 **/
export default config;
