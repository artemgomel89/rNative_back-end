const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token)
    return res.status(401).send({ error: "Access denied. No token provided." });

  try {
    req.user = jwt.verify(token, "jwtPrivateKey");
    next();
  } catch (err) {
    res.status(400).send({ error: "Invalid token." });
  }
};
