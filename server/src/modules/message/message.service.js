const Message = require("./message.model");
const { getOrCreateChat } = require("../chat/chat.service");
const { encrypt, decrypt } = require("../../utils/encryption");

const createMessage = async ({ sender, receiver, content }) => {
  // 1. Get or create chat
  const chat = await getOrCreateChat(sender, receiver);

  // 2. Encrypt content before saving to MongoDB 🔐
  const encryptedContent = encrypt(content);

  // 3. Create message with encrypted content
  const message = await Message.create({
    chat: chat._id,
    sender,
    receiver,
    content: encryptedContent, // 👈 stored encrypted
  });

// 4. Update last message
  chat.lastMessage = message._id;
  await chat.save();

  // return message;
  // 5. Return message with DECRYPTED content for socket emit 👈
  return {
    ...message.toObject(),
    content, // original plaintext — safe over TLS
  };
};

const getMessages = async (chatId) => {
  const messages = await Message.find({ chat: chatId }).sort({ createdAt: 1 });

  // Decrypt each message before returning to client 🔓
  return messages.map((msg) => {
    const msgObj = msg.toObject();
    try {
      msgObj.content = decrypt(msgObj.content);
    } catch (err) {
      // Handles any legacy unencrypted messages gracefully
      console.warn("⚠️ Could not decrypt message, returning as-is:", msg._id);
    }
    return msgObj;
  });
};

module.exports = { createMessage, getMessages };