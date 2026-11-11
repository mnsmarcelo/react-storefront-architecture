module.exports = {
  displayName: 'shell',
  preset: '../../jest.preset.js',
  clearMocks: true,
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  moduleNameMapper: {
    '^@react-storefront-architecture/auth$':
      '<rootDir>/../../libs/shared/auth/src/index.ts',
    '^@react-storefront-architecture/ui$':
      '<rootDir>/../../libs/shared/ui/src/index.ts',
  },
  transformIgnorePatterns: [
    'node_modules/(?!@ant-design/(colors|fast-color)/)',
  ],
  transform: {
    '^.+\\.css$': '@nx/react/plugins/jest',
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nx/react/plugins/jest',
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nx/react/babel'] }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: 'test-output/jest/coverage',
};
