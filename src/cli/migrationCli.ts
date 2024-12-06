import { MigrationAction, MigrationScenario } from "../types/migration";
import { runMigrations } from "../services/migrationRunner";
import { getAllTenantNames } from "../services/tenantService";

export const handleCliInput = async (args: string[]): Promise<void> => {
  const [, , scenario, action, tenantName] = args;

  validateInput(
    scenario as MigrationScenario,
    action as MigrationAction,
    tenantName
  );

  const tenantNames = await getTenantNames(
    scenario as MigrationScenario,
    tenantName
  );

  await runMigrations(
    scenario as MigrationScenario,
    action as MigrationAction,
    tenantNames
  );
};

const validateInput = (
  scenario: MigrationScenario,
  action: MigrationAction,
  tenantName?: string
): void => {
  if (!scenario || !["master", "tenant", "all"].includes(scenario)) {
    throw new Error("Invalid scenario. Use 'master', 'tenant', or 'all'.");
  }

  if (!action || (action !== "up" && action !== "down")) {
    throw new Error("Invalid action. Use 'up' or 'down'.");
  }

  if (scenario === "tenant" && !tenantName) {
    throw new Error(
      "Missing tenant name. Provide the tenant name as the fourth argument for 'tenant' scenario."
    );
  }
};

const getTenantNames = async (
  scenario: MigrationScenario,
  tenantName?: string
): Promise<string[]> => {
  if (scenario === "tenant" && tenantName) {
    return [tenantName];
  } else if (scenario === "all") {
    return await getAllTenantNames();
  }
  return [];
};
