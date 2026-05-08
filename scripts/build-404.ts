import { copyFile } from "node:fs/promises";
import { join } from "node:path";

const clientDir = join(process.cwd(), "build", "client");
const sourcePath = join(clientDir, "404", "index.html");
const outputPath = join(clientDir, "404.html");

await copyFile(sourcePath, outputPath);
