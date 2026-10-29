import { DataSource, DataSourceOptions } from 'typeorm';
import { Emprestimo } from '../emprestimos/entities/emprestimo.entity.js';
import { Equipamento } from '../equipamentos/entities/equipamento.entity.js';
import { Inicial1793206089666 } from './migrations/1793206089666-Inicial.js';

export const opcoesBanco: DataSourceOptions = {
  type: 'better-sqlite3',
  // Os testes e2e trocam o arquivo por um banco em memória (vitest.config.e2e.ts).
  database: process.env.DB_PATH ?? 'data/inventario.sqlite',
  entities: [Equipamento, Emprestimo],
  // Cada migração nova precisa ser acrescentada nesta lista, na ordem em que foi gerada.
  migrations: [Inicial1793206089666],
};

// Usado pela linha de comando do TypeORM para gerar e aplicar migrações.
export default new DataSource(opcoesBanco);