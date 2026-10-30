import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './auth/auth.module.js';
import { opcoesBanco } from './database/data-source.js';
import { EquipamentosModule } from './equipamentos/equipamentos.module.js';
import { EmprestimosModule } from './emprestimos/emprestimos.module.js';

@Module({
  imports: [
    // As tabelas são criadas e alteradas pelas migrações (src/database/migrations),
    // aplicadas automaticamente quando a API sobe.
    TypeOrmModule.forRoot({ ...opcoesBanco, migrationsRun: true }),
    EquipamentosModule,
    EmprestimosModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
