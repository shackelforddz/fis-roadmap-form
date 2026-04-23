"use client";

import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  PRIORITY_SECTION_BY_KEY,
  PRIORITIES_QUESTION,
  ROLE_QUESTION,
  WRAP_UP_QUESTION,
  type PriorityKey,
  type Question,
} from "@/lib/form-config";
import { cn } from "@/lib/utils";
import { submitFeedback } from "@/app/actions";

import { QuestionMulti } from "./question-multi";
import { QuestionOpen } from "./question-open";
import { QuestionSingle } from "./question-single";

type Screen = "splash" | "role" | "priorities" | "priority" | "wrapup" | "thanks";

type Answers = Record<string, string | string[]>;
type WriteIns = Record<string, string>;

const RESET_AFTER_MS = 60_000;

const PRIORITY_ORDER: PriorityKey[] = ["A", "B", "C", "D", "E", "F"];

function initialState() {
  return {
    screen: "splash" as Screen,
    priorityIdx: 0,
    role: "",
    priorities: [] as PriorityKey[],
    prioritiesOther: false,
    prioritiesWriteIn: "",
    answers: {} as Answers,
    writeIns: {} as WriteIns,
    wrapUp: "",
    contactName: "",
    contactEmail: "",
    error: null as string | null,
    submittedId: null as string | null,
  };
}

export function Wizard() {
  const [s, setS] = useState(initialState);
  const [isPending, startTransition] = useTransition();

  // Priorities A-F sorted in canonical order (regardless of tap order).
  const orderedPriorities = useMemo(
    () => PRIORITY_ORDER.filter((k) => s.priorities.includes(k)),
    [s.priorities],
  );

  const totalSteps =
    2 /* role + priorities */ + orderedPriorities.length + 1; /* wrap-up */

  const currentStepIndex = (() => {
    switch (s.screen) {
      case "splash":
        return -1;
      case "role":
        return 0;
      case "priorities":
        return 1;
      case "priority":
        return 2 + s.priorityIdx;
      case "wrapup":
        return 2 + orderedPriorities.length;
      case "thanks":
        return totalSteps;
      default:
        return 0;
    }
  })();

  const progressPct =
    s.screen === "splash"
      ? 0
      : Math.min(
          100,
          Math.round(((currentStepIndex + 1) / totalSteps) * 100),
        );

  const reset = useCallback(() => setS(initialState()), []);

  // Auto-reset after thank-you.
  useEffect(() => {
    if (s.screen !== "thanks") return;
    const t = setTimeout(reset, RESET_AFTER_MS);
    return () => clearTimeout(t);
  }, [s.screen, reset]);

  const start = () => setS((p) => ({ ...p, screen: "role" }));

  const next = () => {
    setS((p) => {
      if (p.screen === "role") return { ...p, screen: "priorities" };
      if (p.screen === "priorities") {
        const ordered = PRIORITY_ORDER.filter((k) => p.priorities.includes(k));
        if (ordered.length > 0) {
          return { ...p, screen: "priority", priorityIdx: 0 };
        }
        return { ...p, screen: "wrapup" };
      }
      if (p.screen === "priority") {
        const ordered = PRIORITY_ORDER.filter((k) => p.priorities.includes(k));
        if (p.priorityIdx < ordered.length - 1) {
          return { ...p, priorityIdx: p.priorityIdx + 1 };
        }
        return { ...p, screen: "wrapup" };
      }
      return p;
    });
  };

  const back = () => {
    setS((p) => {
      if (p.screen === "role") return { ...p, screen: "splash" };
      if (p.screen === "priorities") return { ...p, screen: "role" };
      if (p.screen === "priority") {
        if (p.priorityIdx > 0) {
          return { ...p, priorityIdx: p.priorityIdx - 1 };
        }
        return { ...p, screen: "priorities", priorityIdx: 0 };
      }
      if (p.screen === "wrapup") {
        const ordered = PRIORITY_ORDER.filter((k) => p.priorities.includes(k));
        if (ordered.length > 0) {
          return {
            ...p,
            screen: "priority",
            priorityIdx: ordered.length - 1,
          };
        }
        return { ...p, screen: "priorities" };
      }
      return p;
    });
  };

  const submit = () => {
    setS((p) => ({ ...p, error: null }));
    startTransition(async () => {
      const res = await submitFeedback({
        role: s.role,
        priorities: s.priorities,
        prioritiesWriteIn: s.prioritiesOther ? s.prioritiesWriteIn : "",
        answers: s.answers,
        writeIns: s.writeIns,
        wrapUp: s.wrapUp,
        contactName: s.contactName,
        contactEmail: s.contactEmail,
      });
      if (res.ok) {
        setS((p) => ({ ...p, screen: "thanks", submittedId: res.id }));
      } else {
        setS((p) => ({ ...p, error: res.error }));
      }
    });
  };

  const setAnswer = (id: string, value: string | string[]) =>
    setS((p) => ({ ...p, answers: { ...p.answers, [id]: value } }));
  const setWriteIn = (id: string, value: string) =>
    setS((p) => ({ ...p, writeIns: { ...p.writeIns, [id]: value } }));

  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
      {s.screen !== "splash" && s.screen !== "thanks" && (
        <header className="sticky top-0 z-10 border-b border-border/60 bg-background/80 backdrop-blur">
          <div className="mx-auto flex w-full max-w-3xl items-center gap-4 px-6 py-4">
            <div className="flex-1">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span className="font-medium uppercase tracking-wide">
                  CLS Roadmap Feedback
                </span>
                <span className="tabular-nums">
                  Step {Math.max(0, currentStepIndex) + 1} of {totalSteps}
                </span>
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full bg-primary transition-[width] duration-300"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          </div>
        </header>
      )}

      <main
        className={cn(
          "flex flex-1 flex-col items-stretch",
          s.screen === "splash" || s.screen === "thanks"
            ? "justify-center"
            : "justify-start",
        )}
      >
        <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-6 py-8 sm:py-12">
          {s.screen === "splash" && <Splash onStart={start} />}

          {s.screen === "role" && (
            <QuestionOpen
              question={ROLE_QUESTION}
              value={s.role}
              onChange={(v) => setS((p) => ({ ...p, role: v }))}
            />
          )}

          {s.screen === "priorities" && (
            <QuestionMulti
              question={PRIORITIES_QUESTION}
              values={[
                ...s.priorities,
                ...(s.prioritiesOther ? ["__OTHER__"] : []),
              ]}
              onChange={(next) =>
                setS((p) => ({
                  ...p,
                  priorities: next.filter((v) =>
                    PRIORITY_ORDER.includes(v as PriorityKey),
                  ) as PriorityKey[],
                  prioritiesOther: next.includes("__OTHER__"),
                }))
              }
              writeIn={s.prioritiesWriteIn}
              onWriteInChange={(v) =>
                setS((p) => ({ ...p, prioritiesWriteIn: v }))
              }
            />
          )}

          {s.screen === "priority" && (
            <PrioritySectionView
              priority={orderedPriorities[s.priorityIdx]}
              answers={s.answers}
              writeIns={s.writeIns}
              setAnswer={setAnswer}
              setWriteIn={setWriteIn}
            />
          )}

          {s.screen === "wrapup" && (
            <WrapUp
              wrapUp={s.wrapUp}
              onWrapUp={(v) => setS((p) => ({ ...p, wrapUp: v }))}
              contactName={s.contactName}
              contactEmail={s.contactEmail}
              onContactName={(v) => setS((p) => ({ ...p, contactName: v }))}
              onContactEmail={(v) => setS((p) => ({ ...p, contactEmail: v }))}
            />
          )}

          {s.screen === "thanks" && <Thanks onDone={reset} />}
        </div>
      </main>

      {s.screen !== "splash" && s.screen !== "thanks" && (
        <footer className="sticky bottom-0 border-t border-border/60 bg-background/90 backdrop-blur">
          <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-4 px-6 py-4">
            <Button
              variant="outline"
              onClick={back}
              className="h-16 min-w-[120px] px-6 text-lg"
              disabled={isPending}
            >
              <ArrowLeft className="size-5" />
              Back
            </Button>
            {s.error && (
              <p className="text-sm text-destructive" aria-live="polite">
                {s.error}
              </p>
            )}
            {s.screen === "wrapup" ? (
              <Button
                onClick={submit}
                className="h-16 min-w-[160px] px-6 text-lg"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="size-5 animate-spin" />
                    Submitting
                  </>
                ) : (
                  <>
                    Submit
                    <Check className="size-5" />
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={next}
                className="h-16 min-w-[140px] px-6 text-lg"
                disabled={isPending}
              >
                Next
                <ArrowRight className="size-5" />
              </Button>
            )}
          </div>
        </footer>
      )}
    </div>
  );
}

function Splash({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 text-center">
      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
          CLS Roadmap
        </p>
        <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
          Share your feedback
        </h1>
        <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
          A few quick questions about what would most improve your workflow.
          Takes about three minutes.
        </p>
      </div>
      <Button
        onClick={onStart}
        className="h-20 min-w-[240px] px-10 text-xl"
      >
        Tap to begin
        <ArrowRight className="size-6" />
      </Button>
    </div>
  );
}

function PrioritySectionView({
  priority,
  answers,
  writeIns,
  setAnswer,
  setWriteIn,
}: {
  priority: PriorityKey;
  answers: Answers;
  writeIns: WriteIns;
  setAnswer: (id: string, value: string | string[]) => void;
  setWriteIn: (id: string, value: string) => void;
}) {
  const section = PRIORITY_SECTION_BY_KEY[priority];

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Priority: {priority}
        </p>
        <h2 className="text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
          {section.label}
        </h2>
      </div>
      {section.questions.map((q) => (
        <QuestionRenderer
          key={q.id}
          question={q}
          answers={answers}
          writeIns={writeIns}
          setAnswer={setAnswer}
          setWriteIn={setWriteIn}
        />
      ))}
    </div>
  );
}

function QuestionRenderer({
  question,
  answers,
  writeIns,
  setAnswer,
  setWriteIn,
}: {
  question: Question;
  answers: Answers;
  writeIns: WriteIns;
  setAnswer: (id: string, value: string | string[]) => void;
  setWriteIn: (id: string, value: string) => void;
}) {
  if (question.type === "open") {
    return (
      <QuestionOpen
        question={question}
        value={(answers[question.id] as string) ?? ""}
        onChange={(v) => setAnswer(question.id, v)}
      />
    );
  }
  if (question.type === "single") {
    return (
      <QuestionSingle
        question={question}
        value={(answers[question.id] as string) ?? ""}
        onChange={(v) => setAnswer(question.id, v)}
      />
    );
  }
  return (
    <QuestionMulti
      question={question}
      values={(answers[question.id] as string[]) ?? []}
      onChange={(v) => setAnswer(question.id, v)}
      writeIn={writeIns[question.id] ?? ""}
      onWriteInChange={(v) => setWriteIn(question.id, v)}
    />
  );
}

function WrapUp({
  wrapUp,
  onWrapUp,
  contactName,
  contactEmail,
  onContactName,
  onContactEmail,
}: {
  wrapUp: string;
  onWrapUp: (v: string) => void;
  contactName: string;
  contactEmail: string;
  onContactName: (v: string) => void;
  onContactEmail: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-10">
      <QuestionOpen question={WRAP_UP_QUESTION} value={wrapUp} onChange={onWrapUp} />
      <div className="flex flex-col gap-4 rounded-xl border border-border/60 bg-card/40 p-6">
        <div className="flex flex-col gap-1">
          <p className="text-lg font-medium text-foreground">
            Want us to follow up? (optional)
          </p>
          <p className="text-sm text-muted-foreground">
            Leave your name and email if you&rsquo;d like someone from the CLS
            team to reach out.
          </p>
        </div>
        <label className="flex flex-col gap-2">
          <span className="text-sm text-muted-foreground">Name</span>
          <Input
            value={contactName}
            onChange={(e) => onContactName(e.target.value)}
            placeholder="Your name"
            className="!h-14 !text-lg"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-sm text-muted-foreground">Email</span>
          <Input
            type="email"
            value={contactEmail}
            onChange={(e) => onContactEmail(e.target.value)}
            placeholder="you@example.com"
            className="!h-14 !text-lg"
          />
        </label>
      </div>
    </div>
  );
}

function Thanks({ onDone }: { onDone: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/15">
        <Check className="size-10 text-primary" />
      </div>
      <div className="flex flex-col gap-3">
        <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
          Thank you!
        </h1>
        <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
          Your feedback is invaluable to building the future of CLS.
        </p>
      </div>
      <Button
        onClick={onDone}
        variant="outline"
        className="h-16 min-w-[200px] px-8 text-lg"
      >
        Start new response
      </Button>
      <p className="text-sm text-muted-foreground">
        This screen will reset automatically.
      </p>
    </div>
  );
}
