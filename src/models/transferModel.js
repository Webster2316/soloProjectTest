const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports.createTransferCode = ({ userId, codeHash, expiresAt }) =>
  prisma.transferCode.create({ data: { userId, codeHash, expiresAt } });

module.exports.findValidByHash = (codeHash, now) =>
  prisma.transferCode.findFirst({
    where: {
      codeHash,
      usedAt: null,
      expiresAt: { gt: now }
    }
  });

module.exports.markUsed = (id) =>
  prisma.transferCode.update({
    where: { id },
    data: { usedAt: new Date() }
  });