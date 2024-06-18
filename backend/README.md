# Emergency Management System
![Node 20.12.2](https://shields.io/badge/Node-20.12.2-339933?logo=Node.js&logoColor=FFF&style=flat-square)
![typescript](https://shields.io/badge/TypeScript-3178C6?logo=TypeScript&logoColor=FFF&style=flat-square)
![nestjs](https://shields.io/badge/NestJS-E0234E?logo=NestJS&logoColor=FFF&style=flat-square)
![swagger](https://shields.io/badge/Swagger-85EA2D?logo=Swagger&logoColor=FFF&style=flat-square)
![typeorm](https://shields.io/badge/TypeORM-F37626?logo=TypeORM&logoColor=FFF&style=flat-square)

This project involves the development of an API for an Emergency Management System, proposed as a product for the discipline Computing Systems in Postgraduate Program in Computer Science at the State University of Feira de Santana - UEFS.

For this project, we utilized the [TypeScript](https://www.typescriptlang.org/) programming language with [Node.js](https://nodejs.org/) and the [Nest.js](https://nestjs.com/) framework.

To build the API documentation, we've used [Swagger](https://swagger.io/) tool integrated with Nest.js, accessible through the endpoint: {ems_host}/docs

## Getting Started
### Workspace Dependencies
- [Node 20.12.2](https://nodejs.org/)

### Installation
We are using Node `20.12.2` for this project

```bash
# install dependencies
npm install
```

### Running the app
First, you need to create a `.env` file in the root of the project with the following the .env.example file.

```bash
# first run
npm run migration:run
npm run seed:run
npm run start:dev

# other run
npm run start:dev
```

## Working with migrations

```bash
# generate migrations
npm run migration:generate ./src/database/migrations/MinhaNovaMigration

# run migrations
npm run migration:run

# revert migrations
npm run migration:revert
```

## Working with seeds

```bash
# generate seed
npm run seed:generate ./src/database/seeds/MinhaNovaSeed

# run seed
npm run seed:run

# revert seed
npm run seed:revert
```
