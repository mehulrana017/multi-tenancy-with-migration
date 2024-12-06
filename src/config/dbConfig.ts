import mongoose, { connection } from "mongoose";
import dotenv from "dotenv";

dotenv.config();

let masterConnection: mongoose.Connection | null = null; // Cache the Master DB connection

const connectToMasterDB = async (): Promise<mongoose.Connection> => {
  if (masterConnection && masterConnection.readyState === 1) {
    console.log("Reusing existing Master DB connection");
    return masterConnection;
  }

  try {
    console.log("Connecting to Master DB...");
    masterConnection = await mongoose.createConnection(
      process.env.MASTER_DB_URI!,
      {
        maxPoolSize: 100,
        serverSelectionTimeoutMS: 5000, // 5 seconds
        socketTimeoutMS: 30000,
      }
    );
    console.log("Connected to Master DB");
    return masterConnection;
  } catch (error) {
    console.error("Error connecting to Master DB:", error);
    process.exit(1);
  }
};

const getTenantDBConnection = async (
  tenantDBName: string
): Promise<mongoose.Connection> => {
  const tenantConnections: { [key: string]: mongoose.Connection } = {}; // Cache for tenant DB connections

  // Check if the connection already exists
  if (tenantConnections[tenantDBName]) {
    console.log(`Reusing cached connection for Tenant DB: ${tenantDBName}`);
    return tenantConnections[tenantDBName];
  }

  // Create and cache a new connection
  try {
    const dbURI = process.env.MONGO_URI!.replace("<DB_NAME>", tenantDBName);
    const connection = await mongoose.createConnection(dbURI, {
      maxPoolSize: 50,
      serverSelectionTimeoutMS: 120000,
      socketTimeoutMS: 450000,
    });

    tenantConnections[tenantDBName] = connection;
    console.log(`Created and cached connection for Tenant DB: ${tenantDBName}`);
    return connection;
  } catch (error) {
    console.error(`Error connecting to Tenant DB (${tenantDBName}):`, error);
    throw new Error("Failed to connect to tenant database");
  }
};

export { connectToMasterDB, getTenantDBConnection };
