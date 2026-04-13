import pdf from "pdf-parse";
import mammoth from "mammoth";
import { Buffer } from "node:buffer";

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

      throw new Error(`Unsupported mimetype: ${mimetype}. Use PDF or DOCX.`);
    } catch (error: any) {
      throw new Error(`Extraction failed: ${error.message}`);
    }
  }
}
