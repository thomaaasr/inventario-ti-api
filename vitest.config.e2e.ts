import { existsSync } from 'node:fs';
import { defineConfig } from 'vitest/config';

// O endereço do banco de teste vem do .env (no CI, das variáveis do workflow).
if (existsSync('.env')) {
  process.loadEnvFile();
}

export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    globals: true,
    root: './',
    include: ['**/*.e2e-spec.ts'],
    // Todos os arquivos usam o mesmo banco de teste: um de cada vez, para um não apagar as tabelas do outro.
    fileParallelism: false,
    // Os testes usam um banco separado, que é apagado e recriado antes de cada teste.
    env: { DATABASE_URL: process.env.DATABASE_URL_TESTE ?? '', JWT_SECRET: 'segredo-so-para-testes' },
  },
});
