import { join } from 'node:path';
import { DataSource, DataSourceOptions } from 'typeorm';
import { Emprestimo } from '../emprestimos/entities/emprestimo.entity.js';
import { Equipamento } from '../equipamentos/entities/equipamento.entity.js';

export const opcoesBanco: DataSourceOptions = {
  type: 'better-sqlite3',
  database: 'data/inventario.sqlite',
  entities: [Equipamento, Emprestimo],
  migrations: [join(import.meta.dirname, 'migrations', '*.js')],
};

// Usado pela linha de comando do TypeORM para gerar e aplicar migrações.
export default new DataSource(opcoesBanco);