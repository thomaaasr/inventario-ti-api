import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Emprestimo } from './entities/emprestimo.entity.js';
import { EmprestimosController } from './emprestimos.controller.js';
import { EmprestimosService } from './emprestimos.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Emprestimo])],
  controllers: [EmprestimosController],
  providers: [EmprestimosService],
})
export class EmprestimosModule {}
