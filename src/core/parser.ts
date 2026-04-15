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

    const email =
      text
        .match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)?.[0]
        ?.toLowerCase() || "phantekzy@email.com";
    const phone =
      text.match(
        /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/,
      )?.[0] || null;

    return {
      name: {
        firstName,
        lastName,
        middleName: undefined,
        title: lines[1] || "Software Engineer",
      },
      contact: {
        email,
        phone,
        location: {
          city: null,
          country: null,
          remoteWork: true,
        },
      },
      links: {
        linkedin: fixUrl(
          text.match(/linkedin\.com\/in\/[a-zA-Z0-9-]{3,100}/i)?.[0],
        ),
        github: fixUrl(text.match(/github\.com\/[a-zA-Z0-9-]{1,100}/i)?.[0]),
        portfolio: null,
        other: [],
      },
      summary: lines.slice(2, 6).join(" ").substring(0, 1200) || null,
      experience: [],
      education: [],
      projects: [],
      certifications: [],
    };
  }
  private static findSkills(text: string, list: string[]): string[] {
    return list.filter((s) => {
      const escaped = s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      return new RegExp(`\\b${escaped}\\b`, "i").test(text);
    });
  }
}
