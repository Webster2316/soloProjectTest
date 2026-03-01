require('dotenv').config();  // ensure env is loaded BEFORE Prisma

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

module.exports = prisma;
