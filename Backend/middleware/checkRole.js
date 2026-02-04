import User from "../model/user.js";

const checkrole = (role) => async (req, res, next) => {
  const userId = req.user._id;

  const user = await User.findById(userId);
  if (!user) {
    return res.json({ message: "User not found!" });
  }

  if (role !== user.role) {
    return res.json({ message: `Only ${role} can access this. Access Denied!!` });
  }

  next();
};

export default checkrole;
