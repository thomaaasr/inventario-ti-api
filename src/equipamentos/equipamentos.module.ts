import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EquipamentosService } from './equipamentos.service.js';
import { EquipamentosController } from './equipamentos.controller.js';
import { Equipamento } from './entities/equipamento.entity.js';
import { Emprestimo } from '../emprestimos/entities/emprestimo.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Equipamento, Emprestimo])],
  controllers: [EquipamentosController],
  providers: [EquipamentosService],
})
export class EquipamentosModule {}