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
});
