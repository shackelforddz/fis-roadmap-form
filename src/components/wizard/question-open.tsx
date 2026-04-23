"use client";

import { Textarea } from "@/components/ui/textarea";
import type { Question } from "@/lib/form-config";

export function QuestionOpen({
  question,
  value,
  onChange,
}: {
  question: Question;
  value: string;
  onChange: (next: string) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-2xl leading-snug font-medium text-foreground sm:text-3xl">
        {question.prompt}
      </p>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={question.placeholder ?? "Type your answer…"}
        rows={4}
        className="min-h-32 !text-xl leading-relaxed"
      />
      <p className="text-sm text-muted-foreground">Optional — tap Next to skip.</p>
    </div>
  );
}
