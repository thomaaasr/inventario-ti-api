import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { EmprestimosController } from './emprestimos.controller.js';
import { EmprestimosService } from './emprestimos.service.js';
import { Emprestimo } from './entities/emprestimo.entity.js';

describe('EmprestimosController', () => {
  let controller: EmprestimosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmprestimosController],
      providers: [
        EmprestimosService,
        { provide: getRepositoryToken(Emprestimo), useValue: {} },
        { provide: DataSource, useValue: {} },
      ],
    }).compile();

    controller = module.get<EmprestimosController>(EmprestimosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});