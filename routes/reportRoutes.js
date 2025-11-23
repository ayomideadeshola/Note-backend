const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const User = require("../models/User");

router.get("/amount-spent", async (req, res, next) => {
  try {
    const result = await Order.aggregate([
      { $match: { status: "completed" } },
      { $group: { _id: "$userId", totalSpent: { $sum: "$amount" } } },
      { $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "user" } },
      { $unwind: "$user" },
      { $project: { userId: "$_id", name: "$user.name", totalSpent: 1, _id: 0 } }
    ]);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
