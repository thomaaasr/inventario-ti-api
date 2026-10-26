import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { EquipamentosModule } from './equipamentos/equipamentos.module.js';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'data/inventario.sqlite',
      autoLoadEntities: true,
      // Cria e ajusta as tabelas a partir das entities. Prático no desenvolvimento,
      // mas perigoso em produção: pode apagar dados ao mudar uma coluna.
      synchronize: true,
    }),
    EquipamentosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}