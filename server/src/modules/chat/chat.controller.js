const { getMessages } = require("../message/message.service");
const Chat = require("./chat.model");

const getUserChats = async (req, res) => {
  try {
    const userId = req.user.userId;

    const chats = await Chat.find({
      participants: userId
    })
      .populate("participants", "username email")
      .populate("lastMessage");

    res.json(chats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getChatMessages = async (req, res) => {
  try {
    const { chatId } = req.params;

    const messages = await getMessages(chatId);

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getUserChats, getChatMessages };