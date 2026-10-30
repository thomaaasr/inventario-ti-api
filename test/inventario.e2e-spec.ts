import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { AppModule } from '../src/app.module.js';
import { configurarApp } from '../src/configurar-app.js';

describe('Inventário (e2e)', () => {
  let app: INestApplication<App>;
  let token: string;

  beforeEach(async () => {
    const modulo = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = modulo.createNestApplication();
    configurarApp(app);
    await app.init();

    // Cada teste começa com um usuário cadastrado e logado.
    const credenciais = { email: 'maria@exemplo.com', senha: 'senha-forte-123' };
    await request(app.getHttpServer()).post('/auth/registro').send(credenciais).expect(201);
    const login = await request(app.getHttpServer()).post('/auth/login').send(credenciais).expect(200);
    token = login.body.accessToken;
  });

  afterEach(async () => {
    await app.close();
  });

  const notebook = { tipo: 'Notebook', marca: 'Dell', modelo: 'Latitude 5440', numeroSerie: 'ABC123' };

  it('cadastra um equipamento como disponível', async () => {
    const resposta = await request(app.getHttpServer())
      .post('/equipamentos')
      .auth(token, { type: 'bearer' })
      .send(notebook)
      .expect(201);

    expect(resposta.body).toEqual({ id: 1, ...notebook, status: 'disponivel' });
  });

  it('recusa dados inválidos com 400', async () => {
    await request(app.getHttpServer())
      .post('/equipamentos')
      .auth(token, { type: 'bearer' })
      .send({ tipo: 'Notebook' })
      .expect(400);
  });

  it('recusa número de série repetido com 409', async () => {
    const servidor = app.getHttpServer();
    await request(servidor).post('/equipamentos').auth(token, { type: 'bearer' }).send(notebook).expect(201);
    await request(servidor).post('/equipamentos').auth(token, { type: 'bearer' }).send(notebook).expect(409);
  });

  it('empresta e devolve um equipamento', async () => {
    const servidor = app.getHttpServer();
    await request(servidor).post('/equipamentos').auth(token, { type: 'bearer' }).send(notebook).expect(201);

    const emprestimo = await request(servidor)
      .post('/emprestimos')
      .auth(token, { type: 'bearer' })
      .send({ equipamentoId: 1, responsavel: 'Maria' })
      .expect(201);
    expect(emprestimo.body.equipamento.status).toBe('emprestado');

    await request(servidor)
      .post('/emprestimos')
      .auth(token, { type: 'bearer' })
      .send({ equipamentoId: 1, responsavel: 'João' })
      .expect(409);

    await request(servidor)
      .patch(`/emprestimos/${emprestimo.body.id}/devolucao`)
      .auth(token, { type: 'bearer' })
      .expect(200);
    const equipamento = await request(servidor).get('/equipamentos/1').expect(200);
    expect(equipamento.body.status).toBe('disponivel');
  });

    describe('listagem', () => {
    async function cadastrar(numeroSerie: string, tipo = 'Notebook') {
      await request(app.getHttpServer())
        .post('/equipamentos')
        .auth(token, { type: 'bearer' })
        .send({ ...notebook, tipo, numeroSerie })
        .expect(201);
    }

    it('divide os equipamentos em páginas', async () => {
      for (const numeroSerie of ['S1', 'S2', 'S3']) {
        await cadastrar(numeroSerie);
      }

      const resposta = await request(app.getHttpServer()).get('/equipamentos?pagina=2&limite=2').expect(200);

      expect(resposta.body.total).toBe(3);
      expect(resposta.body.itens.map((e: { numeroSerie: string }) => e.numeroSerie)).toEqual(['S3']);
    });

    it('filtra por tipo', async () => {
      await cadastrar('N1');
      await cadastrar('M1', 'Monitor');

      const resposta = await request(app.getHttpServer()).get('/equipamentos?tipo=Monitor').expect(200);

      expect(resposta.body.total).toBe(1);
      expect(resposta.body.itens[0].numeroSerie).toBe('M1');
    });

    it('recusa paginação inválida com 400', async () => {
      await request(app.getHttpServer()).get('/equipamentos?limite=500').expect(400);
      await request(app.getHttpServer()).get('/equipamentos?pagina=abc').expect(400);
      await request(app.getHttpServer()).get('/equipamentos?status=quebrado').expect(400);
    });
  });

  describe('autenticação', () => {
    it('deixa consultar sem login', async () => {
      await request(app.getHttpServer()).get('/equipamentos').expect(200);
    });

    it('recusa cadastrar sem login com 401', async () => {
      await request(app.getHttpServer()).post('/equipamentos').send(notebook).expect(401);
    });

    it('recusa um token inventado com 401', async () => {
      await request(app.getHttpServer())
        .post('/equipamentos')
        .auth('token-inventado', { type: 'bearer' })
        .send(notebook)
        .expect(401);
    });

    it('recusa senha errada com 401', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'maria@exemplo.com', senha: 'senha-errada-123' })
        .expect(401);
    });

    it('recusa e-mail já cadastrado com 409', async () => {
      await request(app.getHttpServer())
        .post('/auth/registro')
        .send({ email: 'maria@exemplo.com', senha: 'outra-senha-123' })
        .expect(409);
    });
  });
});