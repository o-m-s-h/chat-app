const Message = require("./message.model");
const { getOrCreateChat } = require("../chat/chat.service");

const createMessage = async ({ sender, receiver, content }) => {
  // 1. Get or create chat
  const chat = await getOrCreateChat(sender, receiver);

  // 2. Create message
  const message = await Message.create({
    chat: chat._id,
    sender,
    receiver,
    content
  });

  // 3. Update last message
  chat.lastMessage = message._id;
  await chat.save();

  return message;
};

const getMessages = async (chatId) => {
  return await Message.find({ chat: chatId })
    .sort({ createdAt: 1 });
};

module.exports = { createMessage, getMessages };