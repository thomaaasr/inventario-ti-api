# Inventário de TI — API

API REST para controlar os equipamentos de TI de uma empresa: o que existe, com quem
está e o histórico de empréstimos. Construída com **NestJS 12** e **TypeScript**.

## Regras de negócio

- Todo equipamento começa **disponível**, e o número de série não pode se repetir
- Só é possível emprestar um equipamento **disponível**; a devolução o libera
- O status **emprestado** só muda por empréstimo e devolução, nunca à mão
- Equipamentos com histórico de empréstimos não podem ser excluídos
- Empréstimo e mudança de status são gravados numa **transação**: ou os dois, ou nenhum

## Funcionalidades

- [x] Cadastro de equipamentos (cadastrar, listar, editar e excluir)
- [x] Validação dos dados recebidos
- [x] Armazenamento em banco de dados
- [x] Testes automatizados e documentação interativa (Swagger)
- [x] Empréstimos: quem está com cada equipamento e o histórico de devoluções
- [x] Migrações de banco de dados e testes de ponta a ponta (e2e)

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
npm test           # testes unitários: cada service isolado, com o banco simulado
npm run test:e2e   # testes de ponta a ponta: a API inteira, com um banco em memória
```

## Banco de dados

O banco (SQLite) fica em `data/inventario.sqlite` e é criado na primeira vez que a API sobe.
As tabelas são criadas e alteradas por **migrações** (`src/database/migrations`), aplicadas
automaticamente ao iniciar a API.

Depois de alterar uma entity, gere a migração com as diferenças e confira o arquivo gerado:

```bash
npm run migration:generate -- src/database/migrations/NomeDaMudanca
```
Em seguida, registre a migração nova na lista `migrations` de `src/database/data-source.ts`.

Para desfazer a última migração aplicada:

```bash
npm run migration:revert
```

## Tecnologias

`TypeScript` `Node.js` `NestJS` `TypeORM` `SQLite` `Vitest` `Swagger`