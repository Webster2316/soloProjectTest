const userModel = require('../models/userModel');
const sessionModel = require('../models/sessionModel');
const { hash } = require('../utils/hash');
const { grantDailyTransmissions } = require('../utils/transmissions');
//============================
// DAILY TRANSMISSIONS (POST /grantDaily)
//============================
module.exports.grantDailyTransmissions = async (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Not authenticated' });

  const newCount = await grantDailyTransmissions(req.user);

  res.json({ transmissions: newCount });
};
//============================
//GET USER (GET /me)
//============================
module.exports.getUser = async (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
  res.json({ user: req.user });
};

//============================
//UPDATE USER (PATCH /me)
//============================
module.exports.updateUser = async (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Not authenticated' });

  const { aboutMe, statusText, gender, birthMonth, birthDay, lastSeenAt } = req.body;

  const updated = await userModel.updateUserById(req.user.id, {
    aboutMe,
    statusText,
    gender,
    birthMonth,
    birthDay,
    lastSeenAt // add this here
  });

  res.json({ user: updated });
};

//============================
//DELETE ACCOUNT (DELETE /me)
//============================
module.exports.deleteUser = async (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Not authenticated' });

  // 1) delete session linked to current cookie (optional but clean)
  const sid = req.cookies?.sid;
  if (sid) {
    await sessionModel.deleteByHash(hash(sid));
  }

  // 2) delete any other sessions for this user (covers multiple sessions)
  await sessionModel.deleteManyByUserId(req.user.id);

  // 3) delete user (your schema cascades most related records)
  await userModel.deleteUserById(req.user.id);

  // 4) clear cookie on browser
  res.clearCookie('sid');

  res.json({ message: 'Account deleted' });
};