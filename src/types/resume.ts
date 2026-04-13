import z from "zod";

const DateRangeSchema = z.object({
  startDate: z.coerce.date().nullable(),
  endDate: z.coerce.date().nullable(),
  isCurrent: z.boolean().default(false),
});
