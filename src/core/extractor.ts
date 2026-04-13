import pdf from "pdf-parse";
import { Buffer } from "node:buffer";
export class Extractor {
  static async toText(buffer: Buffer, mimetype: string): Promise<string> {
    try {
      if (mimetype === "application/pdf") {
        const data = await pdf(buffer);
        return data.text;
      }
    } catch (error) {}
  }
}
