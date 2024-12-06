import { handleCliInput } from "../cli/migrationCli";

const main = async () => {
  try {
    await handleCliInput(process.argv);
    process.exit(0);
  } catch (error) {
    console.error("Migration failed", error);
    process.exit(1);
  }
};

main();
