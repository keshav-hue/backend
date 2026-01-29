import User from "../models/User.js";

const mockAuth = async (req, res, next) => {
  // TEMP: always use first user
  const user = await User.findOne();
  if (!user) {
    return res.status(401).json({ message: "No user found" });
  }
  req.user = user;
  next();
};

export default mockAuth;