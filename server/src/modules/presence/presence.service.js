const redis = require("../../config/redis");

const ONLINE_KEY = "online_users"; // Redis hash: userId -> socketIds (JSON array)

// Add a socket for a user
const addUserSocket = async (userId, socketId) => {
  const existing = await redis.hget(ONLINE_KEY, userId);
  const sockets = existing ? JSON.parse(existing) : [];

  if (!sockets.includes(socketId)) {
    sockets.push(socketId);
  }

  await redis.hset(ONLINE_KEY, userId, JSON.stringify(sockets));
};

// Remove a socket for a user, returns true if user is now fully offline
const removeUserSocket = async (userId, socketId) => {
  const existing = await redis.hget(ONLINE_KEY, userId);
  if (!existing) return true;

  const sockets = JSON.parse(existing).filter((id) => id !== socketId);

  if (sockets.length === 0) {
    await redis.hdel(ONLINE_KEY, userId);
    return true; // user fully offline
  }

  await redis.hset(ONLINE_KEY, userId, JSON.stringify(sockets));
  return false; // user still has other sockets
};

// Get all socketIds for a user
const getUserSockets = async (userId) => {
  const existing = await redis.hget(ONLINE_KEY, userId);
  return existing ? JSON.parse(existing) : [];
};

// Get all online userIds
const getOnlineUserIds = async () => {
  const all = await redis.hkeys(ONLINE_KEY);
  return all;
};

// Check if a user is online
const isUserOnline = async (userId) => {
  const existing = await redis.hget(ONLINE_KEY, userId);
  return !!existing;
};

module.exports = {
  addUserSocket,
  removeUserSocket,
  getUserSockets,
  getOnlineUserIds,
  isUserOnline,
};