const jwt = require("jsonwebtoken");
const redis = require("../config/redis"); // 👈 add this

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 👇 Reject HTTP requests made with an old/invalidated token
    const storedIat = await redis.get(`session:${decoded.userId}`);
    if (!storedIat || decoded.iat < parseInt(storedIat)) {
      return res.status(401).json({ error: "Session expired. Please login again." });
    }

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = authMiddleware;