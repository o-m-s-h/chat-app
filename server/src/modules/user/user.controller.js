const User = require("../auth/auth.model");

const getAllUsers = async (req, res) => {
  try {
    console.log("REQ.USER:", req.user); // 🔥 debug

    const currentUserId = req.user.userId;

    const users = await User.find({
      _id: { $ne: currentUserId }
    }).select("-password");

    res.json(users);
  } catch (err) {
    console.log("❌ ERROR:", err); // 🔥 FULL ERROR
    res.status(500).json({ error: err.message });
  }
};

const addContact = async (req, res) => {
  try {
    const { email } = req.body;
    const currentUserId = req.user.userId;

    const userToAdd = await User.findOne({ email });

    if (!userToAdd) {
      return res.status(404).json({ error: "User not found" });
    }

    if (userToAdd._id.toString() === currentUserId) {
      return res.status(400).json({ error: "Cannot add yourself" });
    }

    const currentUser = await User.findById(currentUserId);

    // prevent duplicate
    if (currentUser.contacts.includes(userToAdd._id)) {
      return res.status(400).json({ error: "Already added" });
    }

    currentUser.contacts.push(userToAdd._id);
    await currentUser.save();

    res.json({ message: "User added successfully", user: userToAdd });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};
const getContacts = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .populate("contacts", "-password");

    res.json(user.contacts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { addContact, getContacts, getAllUsers };