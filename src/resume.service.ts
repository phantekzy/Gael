import fs from "fs/promises";
import { Extractor } from "./core/extractor.js";
import { ResumeParser } from "./core/parser.js";
import { ResumeSchema } from "./types/resume.js";

export class ResumeService {
  static async process(filePath: string, mimeType: string) {
    const buffer = await fs.readFile(filePath);

    const rawText = await Extractor.toText(buffer, mimeType);

    const parsedData = ResumeParser.parse(rawText);

    const finalPayload = {
      ...parsedData,
      experience: [],
      education: [],
      projects: [],
      certifications: [],
    };

    return ResumeSchema.parse(finalPayload);
  }
}
