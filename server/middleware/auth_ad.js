const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, "RANDOM_TOKEN");
    const userId = decodedToken.userId;
    const adherentId = decodedToken.adherentId;
    req.auth = {
      userId: userId,
      adherentId: adherentId,
    };
    next();
  } catch (error) {
    res.status(401).json({ error: error | "Requête non authentifiée" });
  }
};
