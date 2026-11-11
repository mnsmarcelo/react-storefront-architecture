module.exports = {
  displayName: 'login',
  preset: '../../jest.preset.js',
  clearMocks: true,
  // Icons import ESM color helpers even through their CommonJS entry point.
  transformIgnorePatterns: [
    'node_modules/(?!@ant-design/(colors|fast-color)/)',
  ],
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  moduleNameMapper: {
    '^@react-storefront-architecture/auth$':
      '<rootDir>/../../libs/shared/auth/src/index.ts',
    '^@react-storefront-architecture/ui$':
      '<rootDir>/../../libs/shared/ui/src/index.ts',
  },
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nx/react/plugins/jest',
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nx/react/babel'] }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: 'test-output/jest/coverage',
  collectCoverageFrom: [
    'src/app/**/*.{ts,tsx}',
    '!src/app/**/*.{spec,test}.{ts,tsx}',
  ],
  coverageReporters: ['text', 'html', 'lcov'],
};
