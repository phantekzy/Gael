import z from "zod";

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
});
