import mongoose from "mongoose";

export interface Migration {
  name: string;
  up: (connection: mongoose.Connection) => Promise<void>;
  down: (connection: mongoose.Connection) => Promise<void>;
}

export type MigrationAction = "up" | "down";
export type MigrationScenario = "master" | "tenant" | "all";
