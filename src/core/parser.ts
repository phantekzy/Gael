import { Sanitizer } from "./sanitizer.js";

export class ResumeParser {
  static parse(rawText: string) {
    const text = Sanitizer.clean(rawText);
  }
}
