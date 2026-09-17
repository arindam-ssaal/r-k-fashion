import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const configDir = path.resolve("config");
const outputDir = path.resolve("builds");

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

const configFiles = fs
  .readdirSync(configDir)
  .filter((file) => file.endsWith(".env"));

for (const configFile of configFiles) {
  const storeName = path.basename(configFile, ".env");

  console.log(`\n==============================`);
  console.log(`Building: ${storeName}`);
  console.log(`==============================`);

  const configPath = path.join(configDir, configFile);
  const envPath = path.resolve(".env");

  fs.copyFileSync(configPath, envPath);

  execSync("vite build", {
    stdio: "inherit",
    shell: true,
  });

  const storeBuildDir = path.join(outputDir, storeName);

  if (fs.existsSync(storeBuildDir)) {
    fs.rmSync(storeBuildDir, { recursive: true, force: true });
  }

  fs.cpSync("dist", storeBuildDir, { recursive: true });

  console.log(`✓ ${storeName} build completed`);
}

console.log("\nAll store builds completed successfully.");