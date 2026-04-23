"use client";

import { cn } from "@/lib/utils";
import type { Question } from "@/lib/form-config";

export function QuestionSingle({
  question,
  value,
  onChange,
}: {
  question: Question;
  value: string;
  onChange: (next: string) => void;
}) {
  if (!question.options) return null;

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl leading-snug font-medium text-foreground sm:text-3xl">
        {question.prompt}
      </h2>
      <div className="flex flex-col gap-3" role="radiogroup">
        {question.options.map((opt) => {
          const selected = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(opt.value)}
              className={cn(
                "group flex items-start gap-4 rounded-xl border-2 bg-card/40 p-5 text-left transition-colors min-h-[88px]",
                "active:scale-[0.995] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                selected
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-foreground/30",
              )}
            >
              <span
                className={cn(
                  "mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2",
                  selected ? "border-primary bg-primary" : "border-muted-foreground",
                )}
              >
                {selected && (
                  <span className="h-2.5 w-2.5 rounded-full bg-primary-foreground" />
                )}
              </span>
              <span className="flex flex-col gap-1">
                <span className="text-lg font-medium leading-tight text-foreground">
                  {opt.label}
                </span>
                {opt.description && (
                  <span className="text-base leading-relaxed text-muted-foreground">
                    {opt.description}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
