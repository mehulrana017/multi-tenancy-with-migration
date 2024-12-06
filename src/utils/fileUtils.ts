import fs from "fs/promises";
import path from "path";
import { Migration } from "../types/migration";

export const loadMigrations = async (
  directory: string
): Promise<Migration[]> => {
  const files = await fs.readdir(directory);

  const migrationPromises = files
    .filter((file) => file.endsWith(".ts") || file.endsWith(".js"))
    .map(async (file) => {
      const migrationPath = path.join(directory, file);
      const { up, down } = await import(migrationPath);
      if (up && down) {
        return { name: file, up, down };
      }
      return null;
    });

  const migrations = (await Promise.all(migrationPromises)).filter(
    (migration): migration is Migration => migration !== null
  );

  return migrations;
};
