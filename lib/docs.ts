import { promises as fs } from "fs";
import path from "path";
import type { Doc } from "./chunking";

const DATA_DIR = path.join(process.cwd(), "data");

export async function loadSampleDocs(): Promise<Doc[]> {
  const files = (await fs.readdir(DATA_DIR)).filter((f) => f.endsWith(".md")).sort();
  return Promise.all(
    files.map(async (file) => {
      const text = await fs.readFile(path.join(DATA_DIR, file), "utf8");
      const heading = text.match(/^#\s+(.+)$/m);
      return { id: file, title: heading ? heading[1].trim() : file, text };
    }),
  );
}
