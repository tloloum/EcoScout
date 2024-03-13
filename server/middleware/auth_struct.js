const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, "RANDOM_TOKEN");
    const userId = decodedToken.userId;
    const structureId = decodedToken.adherentId;
    req.auth = {
      userId: userId,
      structureId: structureId,
    };
    next();
  } catch (error) {
    res.status(401).json({ error: error | "Unauthorized" });
  }
};
