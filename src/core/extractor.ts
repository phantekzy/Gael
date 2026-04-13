import pdf from "pdf-parse";
import { Buffer } from "node:buffer";
import mammoth from "mammoth";
export class Extractor {
  static async toText(buffer: Buffer, mimetype: string): Promise<string> {
    try {
      if (mimetype === "application/pdf") {
        const data = await pdf(buffer);
        return data.text;
      }
      if (
        mimetype ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        const { value } = await mammoth.extractRawText({ buffer });
        return value;
      }
    } catch (error) {}
  }
}
