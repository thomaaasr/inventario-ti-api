# Inventário de TI — API

API REST para controlar os equipamentos de TI de uma empresa: o que existe, com quem
está e o histórico de empréstimos. Construída com **NestJS 12** e **TypeScript**.

> 🚧 Projeto em desenvolvimento, construído em etapas. Acompanhe o progresso abaixo.

## Funcionalidades planejadas

- [x] Cadastro de equipamentos (cadastrar, listar, editar e excluir)
- [x] Validação dos dados recebidos
- [x] Armazenamento em banco de dados
- [x] Testes automatizados e documentação interativa (Swagger)
- [ ] Empréstimos: quem está com cada equipamento e o histórico de devoluções

## Como rodar

Pré-requisito: [Node.js](https://nodejs.org) 24.15 ou superior.

```bash
npm install
npm run start:dev
```

A API sobe em `http://localhost:3000`.

A documentação interativa (Swagger) fica em `http://localhost:3000/docs`: lá dá para
ver todas as rotas, exemplos e erros possíveis, e testar cada uma pelo navegador.

## Testes

```bash
npm test
```

## Tecnologias

`TypeScript` `Node.js` `NestJS` `TypeORM` `SQLite` `Vitest` `Swagger`