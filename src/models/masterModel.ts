import mongoose from "mongoose";

const masterSchema = new mongoose.Schema({
  tenantName: { type: String, required: true },
  email: { type: String, required: true },
  tenantDBName: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Master = mongoose.model("Master", masterSchema);

export default Master;
