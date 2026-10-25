# Inventário de TI — API

API REST para controlar os equipamentos de TI de uma empresa: o que existe, com quem
está e o histórico de empréstimos. Construída com **NestJS 12** e **TypeScript**.

> 🚧 Projeto em desenvolvimento, construído em etapas. Acompanhe o progresso abaixo.

## Funcionalidades planejadas

- [ ] Cadastro de equipamentos (cadastrar, listar, editar e excluir)
- [ ] Validação dos dados recebidos
- [ ] Armazenamento em banco de dados
- [ ] Testes automatizados e documentação interativa (Swagger)
- [ ] Empréstimos: quem está com cada equipamento e o histórico de devoluções

## Como rodar

Pré-requisito: [Node.js](https://nodejs.org) 24.15 ou superior.

```bash
npm install
npm run start:dev
```

A API sobe em `http://localhost:3000`.

## Testes

```bash
npm test
```

## Tecnologias

`TypeScript` `Node.js` `NestJS` `Vitest`