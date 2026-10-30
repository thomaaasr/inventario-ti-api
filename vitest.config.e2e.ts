import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    globals: true,
    root: './',
    include: ['**/*.e2e-spec.ts'],
    // Banco em memória: cada teste começa vazio e o arquivo de verdade não é tocado.
    env: { DB_PATH: ':memory:', JWT_SECRET: 'segredo-so-para-testes' },
  },
});