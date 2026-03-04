const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();



// ##############################################################
// Session Model // database-only functions
// ##############################################################

module.exports.findByHashWithUser = (sessionHash) => {
  return prisma.deviceSession.findUnique({
    where: { sessionHash },
    include: { user: true },
  });
};

module.exports.createSession = ({ userId, sessionHash, expiresAt = null }) => {
  return prisma.deviceSession.create({
    data: { userId, sessionHash, expiresAt },
  });
};

module.exports.deleteByHash = (sessionHash) => {
  return prisma.deviceSession.deleteMany({
    where: { sessionHash },
  });
};

module.exports.deleteManyByUserId = (userId) => {
  return prisma.deviceSession.deleteMany({
    where: { userId },
  });
};

module.exports.touchLastUsed = (id) => {
  return prisma.deviceSession.update({
    where: { id },
    data: { lastUsedAt: new Date() },
  });
};