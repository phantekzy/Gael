import * as pdfjs from "pdfjs-dist";

export class Extractor {
  static async toText(buffer: Uint8Array): Promise<string> {
    const loadingTask = pdfjs.getDocument({ data: buffer });
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
    }
  }
}
