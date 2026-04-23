"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { submissionSchema, type SubmissionInput } from "@/lib/submission-schema";

export type SubmitResult =
  | { ok: true; id: string }
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

  const { data: row, error } = await supabase
    .from("submissions")
    .insert({
      role: data.role || null,
      priorities: data.priorities,
      priorities_write_in: data.prioritiesWriteIn || null,
      answers: data.answers,
      write_ins: data.writeIns,
      wrap_up: data.wrapUp || null,
      contact_name: data.contactName || null,
      contact_email: data.contactEmail || null,
    })
    .select("id")
    .single();

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true, id: row.id };
}
