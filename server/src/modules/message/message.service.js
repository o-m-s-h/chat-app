const Message = require("./message.model");

const createMessage = async ({ sender, receiver, content }) => {
  const message = await Message.create({
    sender,
    receiver,
    content
  });

  return message;
};

module.exports = { createMessage };