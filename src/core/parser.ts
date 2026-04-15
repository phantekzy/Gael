import { Sanitizer } from "./sanitizer.js";

export class ResumeParser {
  static parse(rawText: string) {
    const text = Sanitizer.clean(rawText);
    const lines = text.split("\n").filter((l) => l.length > 0);

    const fixUrl = (url: string | null | undefined) => {
      if (!url) return null;
      const cleanUrl = url.trim();
      return cleanUrl.startsWith("http") ? cleanUrl : `https://${cleanUrl}`;
    };

    const nameParts = lines[0]?.split(" ") || ["Unknown"];
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ") || "User";
  }
}
