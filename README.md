# README

## Introduction

```text
The Contact Management program is designed as a learning medium to understand how to build a RESTful API using TypeScript. Through this project, learners will explore the fundamentals of REST API development, implement basic CRUD operations (Create, Read, Update, Delete), and utilize Express.js within the TypeScript ecosystem. By leveraging TypeScript's static typing system, the project emphasizes writing safe, structured, and maintainable code. This program is ideal for beginners who want to grasp best practices in building modern and efficient backend services.
```

## Setup Project

### Create .env file

```text
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
```

### Running Program

```shell
npm install

npx prisma migrate dev

npx prisma generate

npm run build

npm run start
```
