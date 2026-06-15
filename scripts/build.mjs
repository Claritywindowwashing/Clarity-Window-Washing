import { cp, mkdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const output = path.join(root, "dist");
const pages = ["index.html", "services.html", "gallery.html", "about.html", "contact.html"];

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });

const missing = [];
for (const page of pages) {
  const source = path.join(root, page);
  const html = await readFile(source, "utf8");
  const references = [
    ...html.matchAll(/(?:src|href)="([^"#?]+)"/g),
  ]
    .map((match) => match[1])
    .filter((reference) => !/^(?:https?:|mailto:|tel:|sms:)/.test(reference));

  for (const reference of references) {
    const target = path.resolve(root, path.dirname(page), reference);
    try {
      await stat(target);
    } catch {
      missing.push(`${page}: ${reference}`);
    }
  }

  await writeFile(path.join(output, page), html);
}

if (missing.length) {
  throw new Error(`Build failed. Missing local files:\n${missing.join("\n")}`);
}

await cp(path.join(root, "assets"), path.join(output, "assets"), { recursive: true });
await writeFile(path.join(output, ".nojekyll"), "");

console.log(`Built ${pages.length} pages to dist/`);
