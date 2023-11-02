import { User, Token } from "../../models/index.js";

// logout
export const logout = async (req, res) => {
  try {
    // delete the token from the database
    await Token.deleteOne({ token: req.token, user: req.user._id });

    // set user isOnline to false
    await User.findByIdAndUpdate(req.user._id, { isOnline: false });

    return res.status(200).json({ success: true, message: "logged out" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// block & unblock user by id
export const blockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    // check if the user is found
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "user not found" });

    // check if the user is admin or manager
    if (user.role !== "user")
      return res.status(401).json({ success: false, message: "unauthorized" });

    // check if the user is already blocked then unblock him
    if (user.isBlocked.status) {
      user.isBlocked.status = false;
      user.isBlocked.reason = undefined;
      await user.save();
      return res
        .status(200)
        .json({ success: true, message: "user unblocked successfully" });
    }

    // block the user
    user.isBlocked.status = true;
    user.isBlocked.reason = req.body.reason;
    await user.save();

    return res
      .status(200)
      .json({ success: true, message: "user blocked successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// get the number of users registered monthly for last year
export const monthlyUsers = async (req, res) => {
  try {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

    const users = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: lastYear },
        },
      },
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);

    return res.status(200).json({ success: true, data: users });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
