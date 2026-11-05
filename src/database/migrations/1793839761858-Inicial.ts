import { MigrationInterface, QueryRunner } from 'typeorm';

export class Inicial1793839761858 implements MigrationInterface {
  name = 'Inicial1793839761858';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "usuario" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "senhaHash" character varying NOT NULL, CONSTRAINT "UQ_2863682842e688ca198eb25c124" UNIQUE ("email"), CONSTRAINT "PK_a56c58e5cabaa04fb2c98d2d7e2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "equipamento" ("id" SERIAL NOT NULL, "tipo" character varying NOT NULL, "marca" character varying NOT NULL, "modelo" character varying NOT NULL, "numeroSerie" character varying NOT NULL, "status" character varying NOT NULL DEFAULT 'disponivel', CONSTRAINT "UQ_a9c9be17ba2a8edf2d54d3e76f9" UNIQUE ("numeroSerie"), CONSTRAINT "PK_acf3348d50642a66234d79b0e6b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "emprestimo" ("id" SERIAL NOT NULL, "responsavel" character varying NOT NULL, "dataEmprestimo" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "dataDevolucao" TIMESTAMP WITH TIME ZONE, "equipamentoId" integer NOT NULL, CONSTRAINT "PK_d8f9a723b1f2fd57102a5c424f8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "emprestimo" ADD CONSTRAINT "FK_421a82929ea9f5199772876465f" FOREIGN KEY ("equipamentoId") REFERENCES "equipamento"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "emprestimo" DROP CONSTRAINT "FK_421a82929ea9f5199772876465f"`);
    await queryRunner.query(`DROP TABLE "emprestimo"`);
    await queryRunner.query(`DROP TABLE "equipamento"`);
    await queryRunner.query(`DROP TABLE "usuario"`);
  }
}
