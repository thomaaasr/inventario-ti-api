import { existsSync } from 'node:fs';
import { DataSource, DataSourceOptions } from 'typeorm';
import { Usuario } from '../auth/entities/usuario.entity.js';
import { Emprestimo } from '../emprestimos/entities/emprestimo.entity.js';
import { Equipamento } from '../equipamentos/entities/equipamento.entity.js';
import { Inicial1793839761858 } from './migrations/1793839761858-Inicial.js';

// A linha de comando do TypeORM (migration:generate/run) importa este arquivo sem passar pelo main.ts,
// então o .env precisa ser lido aqui também. Variáveis que já existem no ambiente não são sobrescritas.
if (existsSync('.env')) {
  process.loadEnvFile();
}

if (!process.env.DATABASE_URL) {
  throw new Error('Defina DATABASE_URL no arquivo .env (veja o .env.example).');
}

export const opcoesBanco: DataSourceOptions = {
  type: 'postgres',
  // Exemplo: postgres://usuario:senha@localhost:5432/inventario
  url: process.env.DATABASE_URL,
  entities: [Equipamento, Emprestimo, Usuario],
  // Cada migração nova precisa ser acrescentada nesta lista, na ordem em que foi gerada.
  migrations: [Inicial1793839761858],
};

// Usado pela linha de comando do TypeORM para gerar e aplicar migrações.
export default new DataSource(opcoesBanco);
