import * as pdfjs from "pdfjs-dist/legacy/build/pdf.mjs";
import mammoth from "mammoth";

export class Extractor {
  static async toText(buffer: Buffer, mimetype: string): Promise<string> {
    if (
      mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const { value } = await mammoth.extractRawText({ buffer });
      return value;
    }

    const uint8Array = new Uint8Array(buffer);
    const loadingTask = pdfjs.getDocument({
      data: uint8Array,
      useSystemFonts: true,
      isEvalSupported: false,
    });

    const pdf = await loadingTask.promise;
    let fullText = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();

      const columns: { [key: number]: any[] } = {};

      content.items.forEach((item: any) => {
        const x = Math.round(item.transform[4] / 50) * 50;
        if (!columns[x]) columns[x] = [];
        columns[x].push(item);
      });

      const sortedX = Object.keys(columns)
        .map(Number)
        .sort((a, b) => a - b);

      sortedX.forEach((x) => {
        const columnItems = columns[x].sort(
          (a, b) => b.transform[5] - a.transform[5],
        );

        columnItems.forEach((item) => {
          fullText += item.str + " ";
        });

        fullText += "\n";
      });
    }

    return fullText;
  }
}
