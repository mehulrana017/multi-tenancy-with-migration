import path from "path";
import mongoose from "mongoose";
import { connectToMasterDB, getTenantDBConnection } from "../config/dbConfig";
import { loadMigrations } from "../utils/fileUtils";
import { executeMigrations } from "./migrationExecutor";
import { MigrationAction, MigrationScenario } from "../types/migration";

const DEFAULT_BATCH_SIZE = 50;

const runMigrationsForDB = async (
  connectionProvider: () => Promise<mongoose.Connection>,
  migrationDir: string,
  action: MigrationAction
): Promise<void> => {
  const connection = await connectionProvider();
  const migrations = await loadMigrations(migrationDir);
  await executeMigrations(connection, migrations, action);
};

export const runMigrations = async (
  scenario: MigrationScenario,
  action: MigrationAction,
  tenantNames: string[],
  batchSize = DEFAULT_BATCH_SIZE
): Promise<void> => {
  const masterMigrationsPath = path.join(
    __dirname,
    "..",
    "migrations",
    "master"
  );
  const tenantMigrationsPath = path.join(
    __dirname,
    "..",
    "migrations",
    "tenants"
  );

  switch (scenario) {
    case "master":
      console.log("Running migrations on Master DB...");
      await runMigrationsForDB(connectToMasterDB, masterMigrationsPath, action);
      break;
    case "tenant":
      console.log("Running migrations on Tenant DBs...");
      await runTenantMigrations(
        tenantNames,
        tenantMigrationsPath,
        action,
        batchSize
      );
      break;
    case "all":
      console.log("Running migrations on Master and all Tenant DBs...");
      await runMigrationsForDB(connectToMasterDB, masterMigrationsPath, action);
      await runTenantMigrations(
        tenantNames,
        tenantMigrationsPath,
        action,
        batchSize
      );
      break;
    default:
      throw new Error(`Invalid migration scenario: ${scenario}`);
  }

  console.log("All migrations executed successfully!");
};

const runTenantMigrations = async (
  tenantNames: string[],
  migrationDir: string,
  action: MigrationAction,
  batchSize: number
): Promise<void> => {
  for (let i = 0; i < tenantNames.length; i += batchSize) {
    const batch = tenantNames.slice(i, i + batchSize);
    console.log(`Processing batch: ${Math.floor(i / batchSize) + 1}`);
    const batchPromises = batch.map((tenantName) =>
      runMigrationsForDB(
        () => getTenantDBConnection(tenantName),
        migrationDir,
        action
      )
    );
    await Promise.all(batchPromises);
  }
};
