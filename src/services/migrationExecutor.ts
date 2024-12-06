import mongoose from "mongoose";
import { Migration, MigrationAction } from "../types/migration";
import { getMigrationsModel } from "../models/migrationsModel";

export const executeMigrations = async (
  connection: mongoose.Connection,
  migrations: Migration[],
  action: MigrationAction
): Promise<void> => {
  const MigrationsModel = getMigrationsModel(connection);

  for (const migration of migrations) {
    const existingMigration = await MigrationsModel.findOne({
      name: migration.name,
    });

    if (shouldSkipMigration(action, existingMigration)) {
      console.log(`Skipping migration: ${migration.name}`);
      continue;
    }

    console.log(`Executing migration (${action}): ${migration.name}...`);
    try {
      await migration[action](connection);
      await updateMigrationStatus(MigrationsModel, migration.name, action);
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

const shouldSkipMigration = (
  action: MigrationAction,
  existingMigration: any
): boolean => {
  return (
    (action === "up" && existingMigration) ||
    (action === "down" && !existingMigration)
  );
};

const updateMigrationStatus = async (
  MigrationsModel: mongoose.Model<any>,
  migrationName: string,
  action: MigrationAction
): Promise<void> => {
  if (action === "up") {
    await MigrationsModel.create({ name: migrationName });
  } else if (action === "down") {
    await MigrationsModel.deleteOne({ name: migrationName });
  }
};
