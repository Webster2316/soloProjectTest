const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// ##############################################################
// User Model // database-only functions
// ##############################################################

module.exports.findByUsername = (username) => {
  return prisma.user.findUnique({ where: { username } });
};

module.exports.createUser = (data) => {
  return prisma.user.create({ data });
};

module.exports.updateUserById = (id, data) => {
  return prisma.user.update({ where: { id }, data });
};

module.exports.deleteUserById = (id) => {
  return prisma.user.delete({ where: { id } });
};