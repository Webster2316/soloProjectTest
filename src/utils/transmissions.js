// utils/transmissions.js
const userModel = require('../models/userModel');

module.exports.grantDailyTransmissions = async (user) => {
  const now = new Date();
  
  // check if already granted today
  const lastGrant = user.lastTransmissionGrantAt;
  const isSameDay = lastGrant && new Date(lastGrant).toDateString() === now.toDateString();

  if (!isSameDay) {
    const newTransmissions = (user.transmissions || 0) + 300;

    const updated = await userModel.updateUserById(user.id, {
      transmissions: newTransmissions,
      lastTransmissionGrantAt: now
    });

    return updated.transmissions; // return new count
  }

  return user.transmissions; // already granted today
};