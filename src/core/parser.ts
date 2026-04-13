import { Sanitizer } from "./sanitizer.js";

export class ResumeParser {
  static parse(rawText: string) {
    const text = Sanitizer.clean(rawText);
    const lines = text.split("\n").filter((l) => l.length > 0);

    const email =
      text
        .match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)?.[0]
        ?.toLowerCase() || "phantekzy@email.com";

    const phone =
      text.match(
        /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/,
      )?.[0] || null;
  }
}
