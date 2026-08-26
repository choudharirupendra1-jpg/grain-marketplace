const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

app.use(cors());
app.use(express.json());


// =====================================================
// MONGODB CONNECTION
// =====================================================

// IMPORTANT:
// Yahan apni EXISTING working MongoDB connection string rakho.
// Apna password kisi ke saath share mat karna.

mongoose.connect("mongodb+srv://choudharirupendra1_db_user:Rupen1234@cluster0.jd9fzxc.mongodb.net/?appName=Cluster0")    .then(function () {
        console.log("MongoDB Connected Successfully!");
    })
    .catch(function (error) {
        console.log("MongoDB Connection Failed:", error);
    });


// =====================================================
// USER MODEL
// =====================================================

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    }

});

const User = mongoose.model("User", userSchema);


// =====================================================
// GRAIN MODEL
// =====================================================

const grainSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    quantity: {
        type: Number,
        required: true
    },

    price: {
        type: Number,
        required: true
    },

    seller: {
        type: String,
        required: true
    },

    sellerEmail: {
        type: String,
        default: ""
    }

}, {
    timestamps: true
});

const Grain = mongoose.model("Grain", grainSchema);


// =====================================================
// ORDER MODEL
// =====================================================

const orderSchema = new mongoose.Schema({

    grainId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Grain",
        default: null
    },

    grainName: {
        type: String,
        required: true
    },

    quantity: {
        type: Number,
        required: true
    },

    price: {
        type: Number,
        required: true
    },

    total: {
        type: Number,
        required: true
    },

    seller: {
        type: String,
        default: ""
    },

    sellerEmail: {
        type: String,
        default: ""
    },

    buyer: {
        type: String,
        default: ""
    },

    buyerEmail: {
        type: String,
        default: ""
    },

    status: {
        type: String,
        default: "Pending"
    }

}, {
    timestamps: true
});

const Order = mongoose.model("Order", orderSchema);


// =====================================================
// PORT
// =====================================================

const PORT = 3000;


// =====================================================
// HOME
// =====================================================

app.get("/", function (req, res) {

    res.send("🌾 Grain Marketplace Backend is Running!");

});


// =====================================================
// GET ALL GRAINS
// =====================================================

app.get("/api/grains", async function (req, res) {

    try {

        const grains = await Grain.find().sort({
            createdAt: -1
        });

        res.json(grains);

    } catch (error) {

        console.log("Get Grains Error:", error);

        res.status(500).json({

            success: false,
            message: "Failed to fetch grains."

        });

    }

});


// =====================================================
// GET MY GRAINS
// =====================================================

app.get("/api/grains/my", async function (req, res) {

    try {

        const sellerEmail = req.query.sellerEmail;

        if (!sellerEmail) {

            return res.status(400).json({

                success: false,
                message: "Seller email is required."

            });

        }

        const grains = await Grain.find({
            sellerEmail: sellerEmail
        }).sort({
            createdAt: -1
        });

        res.json({

            success: true,
            grains: grains

        });

    } catch (error) {

        console.log("My Grains Error:", error);

        res.status(500).json({

            success: false,
            message: "Failed to fetch your listings."

        });

    }

});


// =====================================================
// ADD GRAIN
// =====================================================

app.post("/api/grains", async function (req, res) {

    try {

        const {
            name,
            quantity,
            price,
            seller,
            sellerEmail
        } = req.body;

        if (!name || !quantity || !price || !seller) {

            return res.status(400).json({

                success: false,
                message: "Please fill all grain details."

            });

        }

        const newGrain = new Grain({

            name: name,

            quantity: Number(quantity),

            price: Number(price),

            seller: seller,

            sellerEmail: sellerEmail || ""

        });

        const savedGrain = await newGrain.save();

        res.json({

            success: true,

            message: "Grain added successfully! 🌾",

            grain: savedGrain

        });

    } catch (error) {

        console.log("Add Grain Error:", error);

        res.status(500).json({

            success: false,
            message: "Failed to add grain."

        });

    }

});


// =====================================================
// UPDATE GRAIN
// =====================================================

app.put("/api/grains/:id", async function (req, res) {

    try {

        const {
            quantity,
            price
        } = req.body;

        const newQuantity = Number(quantity);
        const newPrice = Number(price);

        if (
            !Number.isFinite(newQuantity) ||
            !Number.isFinite(newPrice) ||
            newQuantity <= 0 ||
            newPrice <= 0
        ) {

            return res.status(400).json({

                success: false,
                message: "Please enter valid quantity and price."

            });

        }

        const updatedGrain = await Grain.findByIdAndUpdate(

            req.params.id,

            {
                quantity: newQuantity,
                price: newPrice
            },

            {
                new: true
            }

        );

        if (!updatedGrain) {

            return res.status(404).json({

                success: false,
                message: "Grain not found."

            });

        }

        res.json({

            success: true,

            message: "Grain updated successfully! ✏️",

            grain: updatedGrain

        });

    } catch (error) {

        console.log("Update Grain Error:", error);

        res.status(500).json({

            success: false,
            message: "Failed to update grain."

        });

    }

});


// =====================================================
// DELETE GRAIN
// =====================================================

app.delete("/api/grains/:id", async function (req, res) {

    try {

        const deletedGrain =
            await Grain.findByIdAndDelete(req.params.id);

        if (!deletedGrain) {

            return res.status(404).json({

                success: false,
                message: "Grain not found."

            });

        }

        res.json({

            success: true,

            message: "Grain deleted successfully! 🗑️"

        });

    } catch (error) {

        console.log("Delete Grain Error:", error);

        res.status(500).json({

            success: false,
            message: "Failed to delete grain."

        });

    }

});


// =====================================================
// REGISTER
// =====================================================

app.post("/api/register", async function (req, res) {

    try {

        const {
            name,
            email,
            password
        } = req.body;

        if (!name || !email || !password) {

            return res.status(400).json({

                success: false,
                message: "Please fill all fields."

            });

        }

        const existingUser =
            await User.findOne({
                email: email
            });

        if (existingUser) {

            return res.status(400).json({

                success: false,
                message: "Email already registered."

            });

        }

        const newUser = new User({

            name: name,

            email: email,

            password: password

        });

        await newUser.save();

        res.json({

            success: true,

            message: "Registration successful!"

        });

    } catch (error) {

        console.log("Register Error:", error);

        res.status(500).json({

            success: false,
            message: "Registration failed."

        });

    }

});


// =====================================================
// LOGIN
// =====================================================

app.post("/api/login", async function (req, res) {

    try {

        const {
            email,
            password
        } = req.body;

        if (!email || !password) {

            return res.status(400).json({

                success: false,
                message: "Please enter email and password."

            });

        }

        const user = await User.findOne({

            email: email,
            password: password

        });

        if (!user) {

            return res.status(401).json({

                success: false,
                message: "Invalid email or password ❌"

            });

        }

        res.json({

            success: true,

            message: "Login Successful! 🎉",

            user: {

                id: user._id,

                name: user.name,

                email: user.email

            }

        });

    } catch (error) {

        console.log("Login Error:", error);

        res.status(500).json({

            success: false,
            message: "Login failed."

        });

    }

});


// =====================================================
// CREATE ORDER
// =====================================================

app.post("/api/orders", async function (req, res) {

    try {

        const {
            grainId,
            grainName,
            quantity,
            price,
            total,
            buyer,
            buyerEmail
        } = req.body;

        const newQuantity = Number(quantity);
        const newPrice = Number(price);
        const newTotal = Number(total);

        if (
            !grainName ||
            !newQuantity ||
            !newPrice ||
            !newTotal
        ) {

            return res.status(400).json({

                success: false,
                message: "Invalid order data."

            });

        }

        if (
            newQuantity <= 0 ||
            newPrice <= 0 ||
            newTotal <= 0
        ) {

            return res.status(400).json({

                success: false,
                message: "Invalid quantity or price."

            });

        }


        // ---------------------------------------------
        // FIND ACTUAL GRAIN
        // ---------------------------------------------

        let grain = null;

        if (grainId) {

            grain = await Grain.findById(grainId);

        }

        if (!grain) {

            grain = await Grain.findOne({
                name: grainName
            });

        }


        // ---------------------------------------------
        // CHECK QUANTITY
        // ---------------------------------------------

        if (grain) {

            if (grain.quantity < newQuantity) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Not enough quantity available."

                });

            }

            grain.quantity =
                grain.quantity - newQuantity;

            await grain.save();

        }


        // ---------------------------------------------
        // CREATE ORDER
        // ---------------------------------------------

        const newOrder = new Order({

            grainId: grain
                ? grain._id
                : null,

            grainName: grain
                ? grain.name
                : grainName,

            quantity: newQuantity,

            price: newPrice,

            total: newTotal,

            seller: grain
                ? grain.seller
                : "",

            sellerEmail: grain
                ? grain.sellerEmail
                : "",

            buyer: buyer || "",

            buyerEmail: buyerEmail || "",

            status: "Pending"

        });

        const savedOrder =
            await newOrder.save();

        res.json({

            success: true,

            message: "Order saved successfully! 🎉",

            order: savedOrder

        });

    } catch (error) {

        console.log("Create Order Error:", error);

        res.status(500).json({

            success: false,
            message: "Failed to create order."

        });

    }

});


// =====================================================
// GET SINGLE ORDER
// =====================================================

app.get("/api/orders/:id", async function (req, res) {

    try {

        const order =
            await Order.findById(req.params.id);

        if (!order) {

            return res.status(404).json({

                success: false,
                message: "Order not found."

            });

        }

        res.json({

            success: true,

            order: order

        });

    } catch (error) {

        console.log("Get Order Error:", error);

        res.status(500).json({

            success: false,
            message: "Failed to get order."

        });

    }

});


// =====================================================
// BUYER ORDER HISTORY
// =====================================================

app.get("/api/orders/buyer/:email", async function (req, res) {

    try {

        const orders = await Order.find({

            buyerEmail: req.params.email

        }).sort({

            createdAt: -1

        });

        res.json({

            success: true,

            orders: orders

        });

    } catch (error) {

        console.log("Buyer Orders Error:", error);

        res.status(500).json({

            success: false,
            message: "Failed to fetch buyer orders."

        });

    }

});


// =====================================================
// SELLER ORDERS
// =====================================================

app.get("/api/orders/seller/:email", async function (req, res) {

    try {

        const orders = await Order.find({

            sellerEmail: req.params.email

        }).sort({

            createdAt: -1

        });

        res.json({

            success: true,

            orders: orders

        });

    } catch (error) {

        console.log("Seller Orders Error:", error);

        res.status(500).json({

            success: false,
            message: "Failed to fetch seller orders."

        });

    }

});


// =====================================================
// CONFIRM ORDER
// =====================================================

app.put("/api/orders/:id/confirm", async function (req, res) {

    try {

        const order =
            await Order.findById(req.params.id);

        if (!order) {

            return res.status(404).json({

                success: false,
                message: "Order not found."

            });

        }

        order.status = "Confirmed";

        const updatedOrder =
            await order.save();

        res.json({

            success: true,

            message:
                "Order Confirmed Successfully! 🎉",

            order: updatedOrder

        });

    } catch (error) {

        console.log("Confirm Order Error:", error);

        res.status(500).json({

            success: false,
            message: "Failed to confirm order."

        });

    }

});


// =====================================================
// CANCEL ORDER
// =====================================================

app.put("/api/orders/:id/cancel", async function (req, res) {

    try {

        const order =
            await Order.findById(req.params.id);

        if (!order) {

            return res.status(404).json({

                success: false,
                message: "Order not found."

            });

        }

        // ---------------------------------------------
        // RETURN GRAIN QUANTITY WHEN ORDER IS CANCELLED
        // ---------------------------------------------

        if (
            order.status === "Pending" &&
            order.grainId
        ) {

            const grain =
                await Grain.findById(order.grainId);

            if (grain) {

                grain.quantity =
                    grain.quantity + order.quantity;

                await grain.save();

            }

        }

        order.status = "Cancelled";

        const updatedOrder =
            await order.save();

        res.json({

            success: true,

            message: "Order Cancelled ❌",

            order: updatedOrder

        });

    } catch (error) {

        console.log("Cancel Order Error:", error);

        res.status(500).json({

            success: false,
            message: "Failed to cancel order."

        });

    }

});


// =====================================================
// START SERVER
// =====================================================

app.listen(PORT, "0.0.0.0", function () {

    console.log(
        `Server running at http://192.168.1.34:${PORT}`
    );

});