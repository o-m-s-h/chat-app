const Chat = require("./chat.model");

// Get or create chat between 2 users
const getOrCreateChat = async (user1, user2) => {
  let chat = await Chat.findOne({
    participants: { $all: [user1, user2], $size: 2 }
  });

  if (!chat) {
    chat = await Chat.create({
      participants: [user1, user2]
    });
  }

  return chat;
};

module.exports = { getOrCreateChat };