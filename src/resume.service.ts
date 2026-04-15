import fs from "fs";
import { Extractor } from "./core/extractor.js";

export class ResumeService {
  static async process(filePath: string, mimeType: string) {
    const buffer = await fs.readFile(filePath);
    const rawText = await Extractor.toText(buffer, mimeType);
  }
}
