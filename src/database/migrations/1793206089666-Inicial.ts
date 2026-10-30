import { MigrationInterface, QueryRunner } from 'typeorm';

export class Inicial1793206089666 implements MigrationInterface {
  name = 'Inicial1793206089666';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "equipamento" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "tipo" varchar NOT NULL, "marca" varchar NOT NULL, "modelo" varchar NOT NULL, "numeroSerie" varchar NOT NULL, "status" varchar NOT NULL DEFAULT ('disponivel'), CONSTRAINT "UQ_a9c9be17ba2a8edf2d54d3e76f9" UNIQUE ("numeroSerie"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "emprestimo" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "responsavel" varchar NOT NULL, "dataEmprestimo" datetime NOT NULL DEFAULT (datetime('now')), "dataDevolucao" datetime, "equipamentoId" integer NOT NULL)`,
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_emprestimo" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "responsavel" varchar NOT NULL, "dataEmprestimo" datetime NOT NULL DEFAULT (datetime('now')), "dataDevolucao" datetime, "equipamentoId" integer NOT NULL, CONSTRAINT "FK_421a82929ea9f5199772876465f" FOREIGN KEY ("equipamentoId") REFERENCES "equipamento" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_emprestimo"("id", "responsavel", "dataEmprestimo", "dataDevolucao", "equipamentoId") SELECT "id", "responsavel", "dataEmprestimo", "dataDevolucao", "equipamentoId" FROM "emprestimo"`,
    );
    await queryRunner.query(`DROP TABLE "emprestimo"`);
    await queryRunner.query(`ALTER TABLE "temporary_emprestimo" RENAME TO "emprestimo"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "emprestimo" RENAME TO "temporary_emprestimo"`);
    await queryRunner.query(
      `CREATE TABLE "emprestimo" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "responsavel" varchar NOT NULL, "dataEmprestimo" datetime NOT NULL DEFAULT (datetime('now')), "dataDevolucao" datetime, "equipamentoId" integer NOT NULL)`,
    );
    await queryRunner.query(
      `INSERT INTO "emprestimo"("id", "responsavel", "dataEmprestimo", "dataDevolucao", "equipamentoId") SELECT "id", "responsavel", "dataEmprestimo", "dataDevolucao", "equipamentoId" FROM "temporary_emprestimo"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_emprestimo"`);
    await queryRunner.query(`DROP TABLE "emprestimo"`);
    await queryRunner.query(`DROP TABLE "equipamento"`);
  }
}
