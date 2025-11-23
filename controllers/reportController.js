const User = require("../models/User");
const Order = require("../models/Order");

exports.getAmountSpentReport = async (req, res) => {
  try {
    const results = await Order.aggregate([
      { $match: { status: "completed" } },

      {
        $group: {
          _id: "$userId",
          totalSpent: { $sum: "$amount" }
        }
      },

      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "id",
          as: "userInfo"
        }
      },

      {
        $unwind: "$userInfo"
      },

      {
        $project: {
          _id: 0,
          userId: "$_id",
          name: "$userInfo.name",
          totalSpent: 1
        }
      }
    ]);

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
