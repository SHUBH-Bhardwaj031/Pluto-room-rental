import User from "../models/User.js";

const adminMiddleware = async (req, res, next) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const user = await User.findById(req.user.userId).select(
      "email"
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    const adminEmail = process.env.ADMIN_EMAIL;

    if (
      !adminEmail ||
      user.email.toLowerCase() !== adminEmail.toLowerCase()
    ) {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }

    req.admin = user;

    next();
  } catch (error) {
    console.error("Admin middleware error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export default adminMiddleware;