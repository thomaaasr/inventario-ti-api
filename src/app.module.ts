import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { EquipamentosModule } from './equipamentos/equipamentos.module.js';

@Module({
  imports: [EquipamentosModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
