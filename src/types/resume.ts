import { z } from "zod";

const DateRangeSchema = z.object({
  startDate: z.coerce.date().nullable(),
  endDate: z.coerce.date().nullable(),
  isCurrent: z.boolean().default(false),
});

export const ResumeSchema = z.object({
  name: z.object({
    firstName: z.string().trim().min(1, "First name is required"),
    lastName: z.string().trim().min(1, "Last name is required"),
    middleName: z.string().trim().optional(),
    title: z.string().trim().optional(),
  }),
  contact: z.object({
    email: z.string().email().toLowerCase().trim(),
    phone: z.string().trim().nullable(),
    location: z
      .object({
        city: z.string().trim().nullable(),
        country: z.string().trim().nullable(),
        remoteWork: z.boolean().default(true),
      })
      .nullable(),
    links: z.object({
      linkedin: z.string().url().nullable(),
      github: z.string().url().nullable(),
      portfolio: z.string().url().nullable(),
      other: z.array(z.string().url()).default([]),
    }),
  }),
  summary: z.string().trim().max(1200).nullable(),
  experience: z
    .array(
      z.object({
        company: z.string().trim().min(1),
        position: z.string().trim().min(1),
        location: z.string().trim().nullable(),
        description: z.string().trim(),
        technologies: z.array(z.string()).default([]),
        ...DateRangeSchema.shape,
      }),
    )
    .default([]),
  education: z
    .array(
      z.object({
        institution: z.string().trim().min(1),
        degree: z.string().trim().min(1),
        fieldOfStudy: z.string().trim().min(1),
        gpa: z.string().trim().nullable(),
        ...DateRangeSchema.shape,
      }),
    )
    .default([]),
  skills: z.object({
    languages: z.array(z.string()),
    frameworks: z.array(z.string()),
    tools: z.array(z.string()),
    softSkills: z.array(z.string()),
  }),
  projects: z
    .array(
      z.object({
        name: z.string().trim().min(1),
        description: z.string().trim(),
        link: z.string().url().nullable(),
        githubRepo: z.string().url().nullable(),
        technologies: z.array(z.string()),
      }),
    )
    .default([]),
  certifications: z
    .array(
      z.object({
        name: z.string().trim(),
        issuer: z.string().trim(),
        issueDate: z.coerce.date().nullable(),
      }),
    )
    .default([]),
  metadata: z.object({
    rawTextLength: z.number(),
    processedAt: z.coerce.date().default(() => new Date()),
    languageDetected: z.string().default("en"),
    version: z.string().default("1.0.0"),
  }),
});

export type ResumeData = z.infer<typeof ResumeSchema>;
