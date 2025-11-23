const Order = require("../models/Order");

exports.createOrder = async (req, res, next) => {
    try {
        const { userId, amount, status } = req.body;

        if (!userId || !amount || !status) {
            return res.status(400).json({ message: "Missing fields" });
        }

        const order = await Order.create({ userId, amount, status });
        res.status(201).json(order);

    } catch (err) {
        next(err);
    }
};

exports.getOrders = async (req, res, next) => {
    try {
        const orders = await Order.find();
        res.json(orders);
    } catch (err) {
        next(err);
    }
};
