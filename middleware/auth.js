const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  const mixtoken = req.headers.authorization;
  if (!mixtoken || !mixtoken.startsWith("Bearer ")) {
    return res.json({ message: "Login required!!" });
  }

  try {
    const token = mixtoken.split(" ")[1];

    const decoder = jwt.verify(token, process.env.ACCESS_Tokan);
    req.user = decoder;
    next();
  } catch (error) {
    return res.json({ message: "Invalid Token" });
  }
};

module.exports = auth;
