import { Connection } from "mongoose";

const mongoose = require("mongoose"); // Import mongoose to use Schema

module.exports = {
  up: async (connection: Connection) => {
    console.log("Adding 'orders' collection to Tenant DB...");

    // Use mongoose.Schema instead of connection.Schema
    const OrderSchema = new mongoose.Schema({
      productId: String,
      quantity: Number,
      totalAmount: Number,
      createdAt: { type: Date, default: Date.now },
    });

    // Attach the schema to the connection's model
    await connection.model("Order", OrderSchema).createCollection();
    console.log("'orders' collection added successfully!");
  },

  down: async (connection: Connection) => {
    console.log("Dropping 'orders' collection from Tenant DB...");
    await connection.dropCollection("orders");
    console.log("'orders' collection dropped successfully!");
  },
};
