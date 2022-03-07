const UserModel = require("../models/userModel")
const ProductModel = require("../models/productModel")
const OrderModel = require("../models/orderModel")

const createOrder = async function (req, res) {
    let order = req.body;
    let userId = req.body.userId;
    let productId = req.body.productId;
    let currentDate = new Date()
    let updatedDate = currentDate.getDate() + "/"
        + currentDate.getMonth() + "/"
        + currentDate.getFullYear()

    if (!userId) {
        return res.send("user Id must be present in the request body");
    }

    let validUserId = await UserModel.findById(userId);
    if (!validUserId) {
        return res.send("no user present with the given id");
    }

    if (!productId) {
        return res.send("product Id must be present in the request body");
    }


    let validProductId = await ProductModel.findById(productId);
    if (!validProductId) {
        return res.send("no product present with the given id");
    }

    let orderCreated = await OrderModel.create(order);
    let value = req.headers["isfreeappuser"]
    if (value == "true") {
        let customer = await OrderModel.findOneAndUpdate(
            { userId: userId },
            { $set: { amount: 0, isFreeAppUser: true, date: updatedDate } },
            { $new: true }

        )
        return res.send({ data: customer })

    }
    else {

        let userBalance = await UserModel.findById(userId)
        let productAmount = await ProductModel.findById(productId)
        let pay = userBalance.balance - productAmount.price
        if (pay >= 0) {
            let customerOrder = await OrderModel.findOneAndUpdate(
                { userId: userId },
                { $set: { amount: productAmount.price, isFreeAppUser: true, date: updatedDate } },
                { $new: true }

            )
            let customer = await UserModel.findOneAndUpdate(
                { _id: userId },
                { $set: { balance: pay, isFreeAppUser: true } },
                { $new: true }

            )
            let result = {}
            result.order = customerOrder
            result.user = customer

            return res.send({ data: result })
        } else {
            return res.send({ msg: "insufficient balance" })
        }

    }

};

module.exports.createOrder = createOrderconst UserModel = require("../models/userModel")
const ProductModel = require("../models/productModel")
const OrderModel = require("../models/orderModel")

const createOrder = async function (req, res) {
    let order = req.body;
    let userId = req.body.userId;
    let productId = req.body.productId;
    let currentDate = new Date()
    let updatedDate = currentDate.getDate() + "/"
        + currentDate.getMonth() + "/"
        + currentDate.getFullYear()

    if (!userId) {
        return res.send("user Id must be present in the request body");
    }

    let validUserId = await UserModel.findById(userId);
    if (!validUserId) {
        return res.send("no user present with the given id");
    }

    if (!productId) {
        return res.send("product Id must be present in the request body");
    }


    let validProductId = await ProductModel.findById(productId);
    if (!validProductId) {
        return res.send("no product present with the given id");
    }

    let orderCreated = await OrderModel.create(order);
    let value = req.headers["isfreeappuser"]
    if (value == "true") {
        let customer = await OrderModel.findOneAndUpdate(
            { userId: userId },
            { $set: { amount: 0, isFreeAppUser: true, date: updatedDate } },
            { $new: true }

        )
        return res.send({ data: customer })

    }
    else {

        let userBalance = await UserModel.findById(userId)
        let productAmount = await ProductModel.findById(productId)
        let pay = userBalance.balance - productAmount.price
        if (pay >= 0) {
            let customerOrder = await OrderModel.findOneAndUpdate(
                { userId: userId },
                { $set: { amount: productAmount.price, isFreeAppUser: true, date: updatedDate } },
                { $new: true }

            )
            let customer = await UserModel.findOneAndUpdate(
                { _id: userId },
                { $set: { balance: pay, isFreeAppUser: true } },
                { $new: true }

            )
            let result = {}
            result.order = customerOrder
            result.user = customer

            return res.send({ data: result })
        } else {
            return res.send({ msg: "insufficient balance" })
        }

    }

};

module.exports.createOrder = createOrder
