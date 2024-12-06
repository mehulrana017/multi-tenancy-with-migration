import mongoose, { Schema, Connection } from "mongoose";

// Migration Metadata Schema
const MigrationSchema = new Schema({
  name: { type: String, required: true, unique: true },
  executedAt: { type: Date, default: Date.now },
});

// Get or define the Migrations model
export const getMigrationsModel = (connection: Connection) => {
  return (
    connection.models["Migrations"] ||
    connection.model("Migrations", MigrationSchema)
  );
};
