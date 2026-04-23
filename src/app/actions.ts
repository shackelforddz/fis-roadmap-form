"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { submissionSchema, type SubmissionInput } from "@/lib/submission-schema";

export type SubmitResult =
  | { ok: true }
  | { ok: false; error: string };

export async function submitFeedback(input: SubmissionInput): Promise<SubmitResult> {
  const parsed = submissionSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Invalid submission: " + parsed.error.issues.map((i) => i.message).join("; "),
    };
  }

  const data = parsed.data;
  const supabase = await createSupabaseServerClient();

  // Insert-only: anon has INSERT but not SELECT by design, so we do not
  // request the inserted row back (no `.select()` — that would require SELECT).
  const { error } = await supabase.from("submissions").insert({
    name: data.name || null,
    role: data.role || null,
    employer: data.employer || null,
    priorities: data.priorities,
    priorities_write_in: data.prioritiesWriteIn || null,
    answers: data.answers,
    write_ins: data.writeIns,
    wrap_up: data.wrapUp || null,
    contact_email: data.contactEmail || null,
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true };
}
