const crypto = require('crypto');
const userModel = require('../models/userModel');
const sessionModel = require('../models/sessionModel');
const { hash } = require('../utils/hash');

// ##############################################################
// getSession // checks if device session exists
// ##############################################################
module.exports.getSession = async (req, res) => {
  // If auth.middleware found a session, req.user exists
  if (!req.user) {
    return res.status(401).json({ message: 'No session' });
  }
  return res.status(200).json({ user: req.user });
};

// ##############################################################
// createUser // creates new user + device session cookie
// ##############################################################
module.exports.createUser = async (req, res) => {
  try {
    const { username, gender, birthMonth, birthDay } = req.body;

    // 1) Validate required input
    if (!username) {
      return res.status(400).json({ message: 'Error: username is required' });
    }

    // 2) Check username uniqueness
    const existing = await userModel.findByUsername(username);
    if (existing) {
      return res.status(400).json({ message: 'Username taken' });
    }

    // 3) Create user with starter rewards
    const user = await userModel.createUser({
      username,
      gender,      // optional (defaults to SECRET in schema)
      birthMonth,  // optional
      birthDay,    // optional
      transmissions: 300,
      tokens: 50,
    });

    // 4) Create session token + store hashed token
    const rawToken = crypto.randomBytes(32).toString('hex'); // cookie value
    const sessionHash = hash(rawToken);

    await sessionModel.createSession({
      userId: user.id,
      sessionHash,
    });

    // 5) Set cookie (so next visit identifies this user)
const THREE_YEARS = 1000 * 60 * 60 * 24 * 1100;

res.cookie("sid", rawToken, {
  httpOnly: true,
  secure: false,        // true when HTTPS
  sameSite: "lax",
  maxAge: THREE_YEARS,
  path: "/",
});

    // 6) Return created user
    return res.status(201).json({ user });
  } catch (error) {
    console.error('Error createUser:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};