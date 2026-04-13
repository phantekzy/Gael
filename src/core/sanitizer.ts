export class Sanitizer {
  static clean(text: string): string {
    return text
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, "")
      .replace(/\s\s+/g, " ")
      .replace(/\n\s*\n/g, "\n")
      .trim();
  }
}
