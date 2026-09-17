import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const configDir = path.resolve("config");
const outputDir = path.resolve("builds");
const zipDir = path.resolve("downloads");

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

if (!fs.existsSync(zipDir)) {
  fs.mkdirSync(zipDir, { recursive: true });
}

const configFiles = fs
  .readdirSync(configDir)
  .filter((file) => file.endsWith(".env"));

function createZip(sourceDir, outputZip) {
  if (fs.existsSync(outputZip)) {
    fs.rmSync(outputZip, { force: true });
  }

  const psPath =
    "C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe";

  const source = path.resolve(sourceDir);
  const output = path.resolve(outputZip);

  execSync(
    `"${psPath}" -NoProfile -Command "Compress-Archive -Path '${source}\\*' -DestinationPath '${output}' -Force"`,
    {
      stdio: "inherit",
      shell: false,
    }
  );

  console.log(`✓ ZIP created: ${outputZip}`);
}

for (const configFile of configFiles) {
  const storeName = path.basename(configFile, ".env");

  console.log(`\n==============================`);
  console.log(`Building: ${storeName}`);
  console.log(`==============================`);

  const configPath = path.join(configDir, configFile);
  const envPath = path.resolve(".env");

  // Apply Store/Environment configuration
  fs.copyFileSync(configPath, envPath);

  // Build
  execSync("vite build", {
    stdio: "inherit",
    shell: true,
  });

  // Store-specific build folder
  const storeBuildDir = path.join(outputDir, storeName);

  if (fs.existsSync(storeBuildDir)) {
    fs.rmSync(storeBuildDir, {
      recursive: true,
      force: true,
    });
  }

  fs.cpSync("dist", storeBuildDir, {
    recursive: true,
  });

  // ZIP
  const zipPath = path.join(zipDir, `${storeName}.zip`);

  createZip(storeBuildDir, zipPath);
}

console.log("\n=================================");
console.log("All builds and ZIPs completed.");
console.log("=================================");