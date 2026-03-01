<!-- # soloProjectTest
# web-app

ST0526 chat app test

## Getting Started

1. Procure 2 Postgres Database (e.g. from Neon DB), one would be used for development and the other for test environment
2. Create 2 `.env` file named `.env.development` and `.env.test` both with the following content:

   ```
   DATABASE_URL=
   PORT=
   ```

   2.1 `DATABASE_URL`: Paste the connection string for development and test environment into the `.env` files respectively.
   2.2 Set PORT to `3000` for `.env.development` and `3001` for `.env.test`

3. Install dependencies: `npm install`
4. Setup database: `npm run migrate:reset`
5. set up migration : `npm run migration reset`
6. Start server: `npm start`
7. Run end-2-end test: `npm test` -->
# ST0526 Chat App (WIP)

Chat app using Node.js + Prisma + PostgreSQL (Neon).

## Getting Started

1. Install dependencies
   npm install

2. Create `.env`
   DATABASE_URL="your_neon_postgres_url"
   PORT=3000

3. Run migrations
   npx prisma migrate dev --name init

4. Start server
   npm start

## Useful Commands
- Prisma Studio:
  npx prisma studio
- Reset DB (DANGER: deletes data):
  npx prisma migrate reset