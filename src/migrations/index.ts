import path from "path";
import fs from "fs/promises";
import mongoose from "mongoose";
import { connectToMasterDB, getTenantDBConnection } from "../config/dbConfig";
import { getMigrationsModel } from "../models/migrationsModel";
import { getAllTenantNames } from "../services/tenantService";

const DEFAULT_BATCH_SIZE = 50; // Number of tenants to process concurrently

// Function to load migrations dynamically
const loadMigrations = async (directory: string) => {
  const files = await fs.readdir(directory);

  const migrationPromises = files
    .filter((file) => file.endsWith(".ts") || file.endsWith(".js"))
    .map(async (file) => {
      const migrationPath = path.join(directory, file);
      const { up, down } = await import(migrationPath);
      if (up && down) {
        return { name: file, up, down };
      }
      return null; // Explicitly return null for invalid migration files
    });

  const migrations = (await Promise.all(migrationPromises)).filter(
    (migration): migration is { name: string; up: Function; down: Function } =>
      migration !== null // Type predicate to filter out null values
  );

  return migrations;
};

// Function to execute migrations
const executeMigrations = async (
  connection: mongoose.Connection,
  migrations: { name: string; up: Function; down: Function }[],
  action: "up" | "down"
) => {
  const MigrationsModel = getMigrationsModel(connection);

  for (const migration of migrations) {
    const existingMigration = await MigrationsModel.findOne({
      name: migration.name,
    });

    if (action === "up" && existingMigration) {
      console.log(`Skipping already executed migration: ${migration.name}`);
      continue;
    }

    if (action === "down" && !existingMigration) {
      console.log(`Skipping non-existent migration: ${migration.name}`);
      continue;
    }

    console.log(`Executing migration (${action}): ${migration.name}...`);
    try {
      await migration[action](connection);

      if (action === "up") {
        await MigrationsModel.create({ name: migration.name });
      } else if (action === "down") {
        await MigrationsModel.deleteOne({ name: migration.name });
      }

      console.log(`Migration (${action}) completed: ${migration.name}`);
    } catch (error) {
      console.error(
        `Error during migration (${action}): ${migration.name}`,
        error
      );
      throw error;
    }
  }
};

// Function to run migrations for master or tenants
const runMigrationsForDB = async (
  connectionProvider: () => Promise<mongoose.Connection>,
  migrationDir: string,
  action: "up" | "down"
) => {
  const connection = await connectionProvider();
  const migrations = await loadMigrations(migrationDir);
  await executeMigrations(connection, migrations, action);
};

// Main function to run migrations
const runMigrations = async (
  scenario: string,
  action: "up" | "down",
  tenantNames: string[],
  batchSize = DEFAULT_BATCH_SIZE
) => {
  const masterMigrationsPath = path.join(__dirname, "master");
  const tenantMigrationsPath = path.join(__dirname, "tenants");

  if (scenario === "master") {
    console.log("Running migrations on Master DB...");
    await runMigrationsForDB(connectToMasterDB, masterMigrationsPath, action);
  } else if (scenario === "tenant") {
    console.log("Running migrations on Tenant DBs...");

    for (let i = 0; i < tenantNames.length; i += batchSize) {
      const batch = tenantNames.slice(i, i + batchSize);
      console.log(`Processing batch: ${i / batchSize + 1}`);
      const batchPromises = batch.map(async (tenantName) => {
        const connectionProvider = () => getTenantDBConnection(tenantName);
        await runMigrationsForDB(
          connectionProvider,
          tenantMigrationsPath,
          action
        );
      });
      await Promise.all(batchPromises);
    }
  } else if (scenario === "all") {
    await runMigrations("master", action, []);
    await runMigrations("tenant", action, tenantNames, batchSize);
  }

  console.log("All migrations executed successfully!");
};

// CLI Arguments Handling
const migrationScenario = process.argv[2]; // "master" | "tenant" | "all"
const action = process.argv[3] as "up" | "down"; // "up" or "down"
const tenantName = process.argv[4]; // Optional tenant name for "tenant" scenario

(async () => {
  try {
    if (!action || (action !== "up" && action !== "down")) {
      console.error("Invalid action. Use 'up' or 'down'.");
      process.exit(1);
    }

    let tenantNames: string[] = [];

    if (migrationScenario === "tenant") {
      if (!tenantName) {
        console.error(
          "Missing tenant name. Provide the tenant name as the fourth argument for 'tenant' scenario."
        );
        process.exit(1);
      }
      tenantNames = [tenantName]; // Use the provided tenant name
    } else if (migrationScenario === "all") {
      tenantNames = await getAllTenantNames(); // Fetch all tenant names for the "all" scenario
    }

    await runMigrations(migrationScenario, action, tenantNames);
    process.exit(0);
  } catch (error) {
    console.error("Migration failed", error);
    process.exit(1);
  }
})();
