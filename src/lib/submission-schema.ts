import { z } from "zod";

const priorityKey = z.enum(["A", "B", "C", "D", "E", "F"]);

const answerValue = z.union([z.string(), z.array(z.string())]);

export const submissionSchema = z.object({
  name: z.string().trim().max(200).optional().default(""),
  role: z.string().trim().max(500).optional().default(""),
  employer: z.string().trim().max(200).optional().default(""),
  priorities: z.array(priorityKey).max(6).default([]),
  prioritiesWriteIn: z.string().trim().max(500).optional().default(""),
  answers: z.record(z.string(), answerValue).default({}),
  writeIns: z.record(z.string(), z.string().max(1000)).default({}),
  wrapUp: z.string().trim().max(2000).optional().default(""),
  contactEmail: z
    .string()
    .trim()
    .max(200)
    .email()
    .optional()
    .or(z.literal(""))
    .default(""),
});

export type SubmissionInput = z.input<typeof submissionSchema>;
export type Submission = z.output<typeof submissionSchema>;
