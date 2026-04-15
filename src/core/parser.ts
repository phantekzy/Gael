import { TECH_DICTIONARY } from "../utils/dictionary.js";
import { Sanitizer } from "./sanitizer.js";

export class ResumeParser {
  static parse(rawText: string) {
    const text = Sanitizer.clean(rawText);
    const lines = text
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    const extractSocials = () => {
      const links: any = { linkedin: null, github: null, portfolio: null };
      const words = text.split(/\s+/);

      const socialTriggers = /github|linkedin|portfolio|website|link/i;

      words.forEach((word, i) => {
        if (socialTriggers.test(word)) {
          const context = words.slice(i, i + 4).join(" ");
          const urlMatch = context.match(/https?:\/\/[^\s]+/i);
          if (urlMatch) {
            const url = urlMatch[0].replace(/[,.;]$/, "");
            if (url.includes("github")) links.github = url;
            else if (url.includes("linkedin")) links.linkedin = url;
            else links.portfolio = url;
          } else {
            const handleMatch = context.match(
              /(?!\bproficient\b|\blinks\b)\b[a-z0-9-._]{4,25}\b/i,
            );
            if (handleMatch && !links.github && /github/i.test(word)) {
              links.github = `https://github.com/${handleMatch[0]}`;
            }
          }
        }
      });
      return links;
    };

    const classifyBlocks = () => {
      const sections: any = {
        summary: "",
        experience: [],
        projects: [],
        education: [],
      };
      let currentSection = "summary";
      let blockBuffer: string[] = [];

      const headers = {
        experience: /EXPERIENCE|WORK|HISTORY|EMPLOYMENT/i,
        projects: /PROJECTS|DEVELOPMENT|LABS/i,
        education: /EDUCATION|ACADEMIC|UNIVERSITY/i,
        skills: /SKILLS|TECHNOLOGIES|TOOLKIT/i,
      };

      lines.forEach((line) => {
        const isHeader =
          Object.values(headers).some((h) => h.test(line)) && line.length < 30;

        if (isHeader) {
          if (blockBuffer.length > 0)
            processBlock(currentSection, blockBuffer, sections);

          if (headers.experience.test(line)) currentSection = "experience";
          else if (headers.projects.test(line)) currentSection = "projects";
          else if (headers.education.test(line)) currentSection = "education";
          else currentSection = "ignored";

          blockBuffer = [];
        } else {
          blockBuffer.push(line);
        }
      });

      processBlock(currentSection, blockBuffer, sections);
      return sections;
    };

    const processBlock = (type: string, lines: string[], target: any) => {
      if (type === "summary") {
        target.summary = lines.join(" ").trim();
      } else if (
        type === "experience" ||
        type === "projects" ||
        type === "education"
      ) {
        target[type] = buildItems(lines);
      }
    };

    const buildItems = (segment: string[]) => {
      const items: any[] = [];
      let active: any = null;

      segment.forEach((line) => {
        const isAnchor =
          line.match(/\d{4}/) || (line.length < 55 && !line.endsWith("."));

        if (isAnchor) {
          if (active) items.push(active);
          active = {
            name: line.replace(/^[•●▪-]\s*/, "").trim(),
            description: "",
            technologies: [],
          };
        } else if (active) {
          active.description += " " + line;
        }
      });
      if (active) items.push(active);
      return items.map((it) => ({
        ...it,
        description: it.description.trim(),
        technologies: this.scan(it.description, [
          ...TECH_DICTIONARY.languages,
          ...TECH_DICTIONARY.frameworks,
        ]),
      }));
    };

    const blocks = classifyBlocks();

    return {
      name: {
        firstName: lines[0]?.split(/\s+/)[0] || "",
        lastName: lines[0]?.split(/\s+/).slice(1).join(" ") || "",
        title: lines[1] || "",
      },
      contact: {
        email:
          text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)?.[0] ||
          "",
        phone:
          text.match(
            /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/,
          )?.[0] || "",
        location: {
          city:
            text.match(/([A-Z][a-z]+(?: [A-Z][a-z]+)*),\s*[A-Z][a-z]+/)?.[1] ||
            null,
          country:
            text.match(
              /([A-Z][a-z]+(?: [A-Z][a-z]+)*),\s*([A-Z][a-z]+)/,
            )?.[2] || null,
          remoteWork: /remote/i.test(text),
        },
        links: extractSocials(),
      },
      ...blocks,
      skills: {
        languages: this.scan(text, TECH_DICTIONARY.languages),
        frameworks: this.scan(text, TECH_DICTIONARY.frameworks),
        infrastructure: this.scan(text, TECH_DICTIONARY.infrastructure || []),
        databases: this.scan(text, TECH_DICTIONARY.databases),
        tools: this.scan(text, TECH_DICTIONARY.tools),
        concepts: this.scan(text, TECH_DICTIONARY.concepts || []),
        softSkills: this.scan(text, TECH_DICTIONARY.softSkills || []),
      },
      metadata: {
        rawTextLength: text.length,
        processedAt: new Date().toISOString(),
        version: "17.0.0-ai-heuristic",
      },
    };
  }

  private static scan(t: string, list: string[]): string[] {
    return (list || []).filter((s) =>
      new RegExp(`\\b${s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i").test(
        t,
      ),
    );
  }
}
