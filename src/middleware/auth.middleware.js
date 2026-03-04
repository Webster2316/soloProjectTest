const sessionModel = require('../models/sessionModel');
const { hash } = require('../utils/hash');

// ##############################################################
// authMiddleware // attaches req.user if cookie session is valid
// ##############################################################
module.exports.authMiddleware = async (req, res, next) => {
  try {
    const sid = req.cookies?.sid;        // read cookie named "sid"
    if (!sid) return next();             // no cookie = not logged in

    const sessionHash = hash(sid);       // hash cookie so it matches DB storage
    const session = await sessionModel.findByHashWithUser(sessionHash);

    if (!session) return next();         // cookie exists but session not found

    req.user = session.user;             // attach the user to the request
    await sessionModel.touchLastUsed(session.id);

    return next();
  } catch (error) {
    console.error('Error authMiddleware:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};