const sessionModel = require('../models/sessionModel');
const { hash } = require('../utils/hash');
const THREE_YEARS = 1000 * 60 * 60 * 24 * 1100;

module.exports.authMiddleware = async (req, res, next) => {
  try {
    const sid = req.cookies?.sid;
    if (!sid) return next();

    const sessionHash = hash(sid);
    const session = await sessionModel.findByHashWithUser(sessionHash);

    if (!session) return next();

    req.user = session.user;

    await sessionModel.touchLastUsed(session.id);

    // refresh cookie expiry
    res.cookie("sid", sid, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: THREE_YEARS
    });

    return next();
  } catch (error) {
    console.error("Error authMiddleware:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};