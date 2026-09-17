import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const store = process.argv[2];

if (!store) {
  console.error("Please provide a store name.");
  console.error("Example: npm run build:store deehub-main");
  process.exit(1);
}

const configFile = path.resolve(`config/${store}.env`);

if (!fs.existsSync(configFile)) {
  console.error(`Config file not found: ${configFile}`);
  process.exit(1);
}

const envContent = fs.readFileSync(configFile, "utf8");

const envFile = path.resolve(".env");

fs.writeFileSync(envFile, envContent);

console.log(`Building for: ${store}`);

try {
  execSync("vite build", {
    stdio: "inherit",
    shell: true,
  });

  console.log(`Build completed successfully for: ${store}`);
} catch (error) {
  console.error(`Build failed for: ${store}`);
  process.exit(1);
}