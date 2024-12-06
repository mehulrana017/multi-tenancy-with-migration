import { Connection } from "mongoose";

const mongoose = require("mongoose");

module.exports = {
  up: async (connection: Connection) => {
    console.log("Adding 'users' collection to Master DB...");

    // Use mongoose.Schema instead of connection.Schema
    const UserSchema = new mongoose.Schema({
      name: String,
      email: String,
      createdAt: { type: Date, default: Date.now },
    });

    // Create the collection and associate it with the schema
    const UserModel = connection.model("User", UserSchema);

    await UserModel.createCollection(); // Explicitly create the collection
    console.log("'users' collection added successfully!");
  },

  down: async (connection: Connection) => {
    console.log("Dropping 'users' collection from Master DB...");
    await connection.dropCollection("users");
    console.log("'users' collection dropped successfully!");
  },
};
