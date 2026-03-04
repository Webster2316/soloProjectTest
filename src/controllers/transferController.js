const crypto = require('crypto');
const { hash } = require('../utils/hash');
const transferModel = require('../models/transferModel');
const sessionModel = require('../models/sessionModel');

// Helper: human-friendly code
function makeCode() {
  // 8 chars grouped like ABCD-EFGH (easy to type)
  const raw = crypto.randomBytes(4).toString('hex').toUpperCase(); // 8 hex chars
  return raw.slice(0,4) + '-' + raw.slice(4);
}

// ##############################################################
// generateTransferCode (old device)
// ##############################################################
module.exports.generateTransferCode = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Not authenticated' });

    const code = makeCode();
    const codeHash = hash(code);

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await transferModel.createTransferCode({
      userId: req.user.id,
      codeHash,
      expiresAt
    });

    return res.status(201).json({ code, expiresAt });
  } catch (err) {
    console.error('Error generateTransferCode:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// ##############################################################
// redeemTransferCode (new device)
// ##############################################################
module.exports.redeemTransferCode = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ message: 'Code is required' });

    const normalized = String(code).trim().toUpperCase();
    const codeHash = hash(normalized);

    const now = new Date();
    const record = await transferModel.findValidByHash(codeHash, now);
    if (!record) {
      return res.status(400).json({ message: 'Invalid or expired code' });
    }

    // Create a new device session for same user
    const rawToken = crypto.randomBytes(32).toString('hex');
    const sessionHash = hash(rawToken);

    await sessionModel.createSession({
      userId: record.userId,
      sessionHash
    });

    // Mark code used (one-time)
    await transferModel.markUsed(record.id);

    // Optional: make it “one device only” by removing all other sessions
    // (Do this AFTER creating the new one, so you don't lock yourself out)
    await sessionModel.deleteManyByUserId(record.userId);
    await sessionModel.createSession({ userId: record.userId, sessionHash });

    res.cookie('sid', rawToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
    });

    return res.status(200).json({ message: 'Transfer complete' });
  } catch (err) {
    console.error('Error redeemTransferCode:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};