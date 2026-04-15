import pdf from "pdf-parse";
import { Buffer } from "node:buffer";

export class Extractor {
  static async toText(buffer: Buffer): Promise<string> {
    const options = {
      pagerender: (pageData: any) => {
        return pageData.getTextContent().then((textContent: any) => {
          const items = textContent.items.sort((a: any, b: any) => {
            if (Math.abs(a.transform[5] - b.transform[5]) > 5) {
              return b.transform[5] - a.transform[5];
            }
            return a.transform[4] - b.transform[4];
          });

          let lastY,
            text = "";
          for (let item of items) {
            if (lastY !== item.transform[5] && lastY !== undefined)
              text += "\n";
            text += item.str + " ";
            lastY = item.transform[5];
          }
          return text;
        });
      },
    };
    const data = await pdf(buffer, options);
    return data.text;
  }
}
