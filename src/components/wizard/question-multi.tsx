"use client";

import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import type { Question } from "@/lib/form-config";

export function QuestionMulti({
  question,
  values,
  onChange,
  writeIn,
  onWriteInChange,
}: {
  question: Question;
  values: string[];
  onChange: (next: string[]) => void;
  writeIn?: string;
  onWriteInChange?: (next: string) => void;
}) {
  if (!question.options) return null;

  const toggle = (value: string) => {
    if (values.includes(value)) {
      onChange(values.filter((v) => v !== value));
    } else {
      onChange([...values, value]);
    }
  };

  const otherSelected = question.allowWriteIn && values.includes("__OTHER__");

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl leading-snug font-medium text-foreground sm:text-3xl">
        {question.prompt}
      </h2>
      <p className="-mt-4 text-base text-muted-foreground">Select all that apply.</p>
      <div className="flex flex-col gap-3">
        {question.options.map((opt) => {
          const selected = values.includes(opt.value);
          return (
            <button
              key={opt.value}
              type="button"
              role="checkbox"
              aria-checked={selected}
              onClick={() => toggle(opt.value)}
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
                  "mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2",
                  selected
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-muted-foreground",
                )}
              >
                {selected && (
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
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

        {question.allowWriteIn && (
          <button
            type="button"
            role="checkbox"
            aria-checked={!!otherSelected}
            onClick={() => toggle("__OTHER__")}
            className={cn(
              "group flex items-start gap-4 rounded-xl border-2 bg-card/40 p-5 text-left transition-colors min-h-[88px]",
              "active:scale-[0.995] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              otherSelected
                ? "border-primary bg-primary/10"
                : "border-border hover:border-foreground/30",
            )}
          >
            <span
              className={cn(
                "mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2",
                otherSelected
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-muted-foreground",
              )}
            >
              {otherSelected && (
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </span>
            <span className="flex flex-col gap-1">
              <span className="text-lg font-medium leading-tight text-foreground">
                Other
              </span>
              <span className="text-base leading-relaxed text-muted-foreground">
                Something not listed above.
              </span>
            </span>
          </button>
        )}
      </div>

      {otherSelected && onWriteInChange && (
        <Textarea
          value={writeIn ?? ""}
          onChange={(e) => onWriteInChange(e.target.value)}
          placeholder="Tell us more…"
          rows={3}
          className="!text-xl leading-relaxed"
        />
      )}
    </div>
  );
}
