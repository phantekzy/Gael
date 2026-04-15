import { TECH_DICTIONARY } from "../utils/dictionary.js";
import { Sanitizer } from "./sanitizer.js";

export class ResumeParser {
  static parse(rawText: string) {
    const text = Sanitizer.clean(rawText);
    const lines = text.split("\n").filter((l) => l.trim().length > 0);

    const fixUrl = (domain: string, handle: string | null | undefined) => {
      if (!handle) return null;
      const clean = handle.trim();
      return clean.startsWith("http") ? clean : `https://${domain}/${clean}`;
    };

    const nameParts = lines[0]?.split(" ") || ["Unknown"];
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ") || "User";

    const email =
      text
        .match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)?.[0]
        ?.toLowerCase() || "placeholder@email.com";
    const phone =
      text.match(
        /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/,
      )?.[0] || null;

    const locationMatch = text.match(
      /([A-Z][a-z]+(?: [A-Z][a-z]+)*),\s*([A-Z][a-z]+(?: [A-Z][a-z]+)*)/,
    );

    const linkedinMatch = text.match(
      /(?:linkedin\.com\/in\/|linkedin:\s*|in\s+)([a-zA-Z0-9-]+)/i,
    );
    const githubMatch = text.match(
      /(?:github\.com\/|github:\s*)([a-zA-Z0-9-]+)/i,
    );

    const profileMatch = text.match(
      /(?:Profile|Summary)\s+([\s\S]{100,800}?)(?=\n[A-Z][a-z]+|\n\n|$)/i,
    );
    const summary = profileMatch
      ? profileMatch[1].replace(/\n/g, " ").trim()
      : lines.find((l) => l.length > 80 && !l.includes("@")) || null;

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
          city: locationMatch ? locationMatch[1].trim() : null,
          country: locationMatch ? locationMatch[2].trim() : null,
          remoteWork: true,
        },
        links: {
          linkedin: fixUrl("linkedin.com/in", linkedinMatch?.[1]),
          github: fixUrl("github.com", githubMatch?.[1]),
          portfolio: null,
          other: [],
        },
      },
      summary,

      experience: [],
      education: [],
      projects: [],
      certifications: [],

      skills: {
        languages: this.findSkills(text, TECH_DICTIONARY.languages),
        frameworks: this.findSkills(text, TECH_DICTIONARY.frameworks),
        infrastructure: this.findSkills(text, TECH_DICTIONARY.infrastructure),
        databases: this.findSkills(text, TECH_DICTIONARY.databases),
        tools: this.findSkills(text, TECH_DICTIONARY.tools),
        concepts: this.findSkills(text, TECH_DICTIONARY.concepts),
        softSkills: this.findSkills(text, TECH_DICTIONARY.softSkills),
      },
      metadata: {
        rawTextLength: text.length,
        processedAt: new Date(),
        languageDetected: "en",
        version: "1.0.0",
      },
    };
  }

  private static findSkills(text: string, list: string[]): string[] {
    return list.filter((s) => {
      const escaped = s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      return new RegExp(`\\b${escaped}\\b`, "i").test(text);
    });
  }
}
