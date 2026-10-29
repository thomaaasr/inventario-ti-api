import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { AppModule } from '../src/app.module.js';

describe('Inventário (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const modulo = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = modulo.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  const notebook = { tipo: 'Notebook', marca: 'Dell', modelo: 'Latitude 5440', numeroSerie: 'ABC123' };

  it('cadastra um equipamento como disponível', async () => {
    const resposta = await request(app.getHttpServer()).post('/equipamentos').send(notebook).expect(201);

    expect(resposta.body).toEqual({ id: 1, ...notebook, status: 'disponivel' });
  });

  it('recusa dados inválidos com 400', async () => {
    await request(app.getHttpServer()).post('/equipamentos').send({ tipo: 'Notebook' }).expect(400);
  });

  it('recusa número de série repetido com 409', async () => {
    await request(app.getHttpServer()).post('/equipamentos').send(notebook).expect(201);
    await request(app.getHttpServer()).post('/equipamentos').send(notebook).expect(409);
  });

  it('empresta e devolve um equipamento', async () => {
    const servidor = app.getHttpServer();
    await request(servidor).post('/equipamentos').send(notebook).expect(201);

    const emprestimo = await request(servidor)
      .post('/emprestimos')
      .send({ equipamentoId: 1, responsavel: 'Maria' })
      .expect(201);
    expect(emprestimo.body.equipamento.status).toBe('emprestado');

    await request(servidor).post('/emprestimos').send({ equipamentoId: 1, responsavel: 'João' }).expect(409);

    await request(servidor).patch(`/emprestimos/${emprestimo.body.id}/devolucao`).expect(200);
    const equipamento = await request(servidor).get('/equipamentos/1').expect(200);
    expect(equipamento.body.status).toBe('disponivel');
  });
});