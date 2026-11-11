import { ModuleFederationConfig } from '@nx/module-federation';

const config: ModuleFederationConfig = {
  name: 'shell',
  // Keep React bound to the singleton already loaded by the shell.
  disableNxRuntimeLibraryControlPlugin: true,
  /**
   * To use a remote that does not exist in your current Nx Workspace
   * You can use the tuple-syntax to define your remote
   *
   * remotes: [['my-external-remote', 'https://nx-angular-remote.netlify.app']]
   *
   * You _may_ need to add a `remotes.d.ts` file to your `src/` folder declaring the external remote for tsc, with the
   * following content:
   *
   * declare module 'my-external-remote';
   *
   */
  // Remotes are registered at runtime from module-federation.manifest.json.
  remotes: [],
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
