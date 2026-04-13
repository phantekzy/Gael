import z from "zod";

const DateRangeSchema = z.object({
  startDate: z.string().nullable(),
  endDate: z.string().nullable(),
  isCurrent: z.boolean().default(false),
});
