import { Request, Response, NextFunction } from "express";
import { getTenantDBConnection } from "../config/dbConfig";
import mongoose from "mongoose";
import { setTimeout } from "timers/promises";

// Sample Data Model
interface SampleData {
  name: string;
  email: string;
}

export const insertSampleData = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const {
    tenantName,
    sampleData,
  }: { tenantName: string; sampleData: SampleData[] } = req.body;

  // Basic validation for sampleData
  if (!Array.isArray(sampleData) || sampleData.length === 0) {
    res.status(400).json({ message: "Invalid or empty sampleData array" });
    return;
  }

  try {
    const tenantDBName = `tenant_${tenantName.toLowerCase()}`;

    // Get the tenant DB connection
    const tenantConnection = await getTenantDBConnection(tenantDBName);

    // Get or define the SampleData model
    const SampleModel =
      tenantConnection.models["SampleData"] ||
      tenantConnection.model(
        "SampleData",
        new mongoose.Schema({
          name: { type: String, required: true },
          email: { type: String, required: true },
        })
      );

    // Perform bulk insert in batches to avoid overloading the system
    const batchSize = 50; // Adjust the batch size as needed
    for (let i = 0; i < sampleData.length; i += batchSize) {
      const batch = sampleData.slice(i, i + batchSize);
      await SampleModel.insertMany(batch);
    }

    res.status(200).json({
      message: `Sample data inserted successfully into ${tenantDBName}.`,
    });
  } catch (error) {
    next(error);
  }
};
