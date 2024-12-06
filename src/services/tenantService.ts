import mongoose from "mongoose";
import { MongoClient } from "mongodb";
import { connectToMasterDB, getTenantDBConnection } from "../config/dbConfig";

export const createTenantDB = async (tenantDBName: string) => {
  const tenantConnection = await getTenantDBConnection(tenantDBName);

  const tenantSchema = new mongoose.Schema({
    data: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  });

  const TenantModel = tenantConnection.model("TenantData", tenantSchema);

  console.log(`Schema created for DB: ${tenantDBName}`);
  return TenantModel;
};

// export const getAllTenantNames = async (): Promise<string[]> => {
//   const masterConnection = await connectToMasterDB();
//   const TenantModel = masterConnection.model(
//     "Tenant",
//     new mongoose.Schema({
//       name: String,
//       dbName: String,
//     })
//   );

//   const tenants = await TenantModel.find().select("dbName").lean();
//   return tenants
//     .map((tenant) => tenant.dbName)
//     .filter((dbName): dbName is string => !!dbName);
// };

export const getAllTenantNames = async (): Promise<string[]> => {
  const client = new MongoClient(process.env.MONGO_URI!);
  await client.connect();

  const databases = await client.db().admin().listDatabases();
  await client.close();

  return databases.databases
    .filter((db) => db.name.startsWith("tenant_"))
    .map((db) => db.name);
};
