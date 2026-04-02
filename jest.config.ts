// jest.config.ts : configuration de Jest pour TypeScript
// - preset ts-jest : permet d'exécuter les fichiers TypeScript directement
// - testEnvironment node : on est dans un contexte Node.js (API), pas un navigateur
// - clearMocks : réinitialise les mocks entre chaque test (non régression)
import type { Config } from 'jest';

const config: Config = {
  testEnvironment: 'node',
  testMatch: ['<rootDir>/src/__tests__/**/*.test.ts'],
  clearMocks: true,
  transform: {
    '^.+\\.ts$': ['ts-jest', { tsconfig: './tsconfig.test.json' }],
  },
};

export default config;
