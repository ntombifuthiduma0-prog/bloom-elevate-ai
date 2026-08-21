import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { generateEmail, type GeneratedEmail } from "@/lib/ai.functions";
import { logActivity } from "@/lib/activity";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator | Bloom & Elevate AI" },
      {
        name: "description",
        content:
          "Draft warm, professional Bloom & Elevate client emails with AI, then review and edit before sending.",
      },
      { property: "og:title", content: "Smart Email Generator | Bloom & Elevate AI" },
      {
        property: "og:description",
        content: "Generate friendly, clear client emails for Bloom & Elevate events.",
      },
    ],
  }),
  component: EmailGenerator,
});

const TONES = [
  "Friendly",
  "Professional",
  "Warm",
  "Follow-up",
  "Empathetic",
  "Thank-you",
  "Reminder",
] as const;

const EMPTY = {
  purpose: "",
  clientName: "",
  situation: "",
  details: "",
  outcome: "",
  tone: "Friendly" as string,
};

function fullEmailText(email: GeneratedEmail) {
  return `Subject: ${email.subject}\n\n${email.greeting}\n\n${email.body}\n\n${email.closing}`;
}

function EmailGenerator() {
  const runGenerate = useServerFn(generateEmail);
  const [form, setForm] = useState(EMPTY);
  const [email, setEmail] = useState<GeneratedEmail | null>(null);
  const [draft, setDraft] = useState("");
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (key: keyof typeof EMPTY) => (value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  async function generate() {
    if (form.purpose.trim().length < 3) {
      setError("Please describe the purpose of this email before generating.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await runGenerate({ data: form });
      setEmail(result);
      setDraft(fullEmailText(result));
      setEditing(false);
      logActivity({
        icon: "email",
        title: "Email generated",
        detail: result.subject,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function clearAll() {
    setForm(EMPTY);
    setEmail(null);
    setDraft("");
    setEditing(false);
    setError(null);
  }

  async function copy() {
    const text = editing || draft ? draft : email ? fullEmailText(email) : "";
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Draft copied — review it before sending.");
    } catch {
      toast.error("Could not copy. Please select the text manually.");
    }
  }

  return (
    <AppShell
      title="Smart Email Generator"
      subtitle="Draft warm, clear client emails in the Bloom & Elevate voice — then review and edit."
    >
      <div className="grid gap-8 px-6 pb-4 sm:px-8 xl:grid-cols-2">
        <section className="card-soft p-6 sm:p-8">
          <h3 className="font-display mb-6 text-xl">Tell the AI about this email</h3>

          <div className="space-y-5">
            <Field
              label="Email purpose"
              required
              value={form.purpose}
              onChange={set("purpose")}
              placeholder="e.g. Remind a client to confirm their Saturday booking"
              textarea
            />
            <Field
              label="Client name (optional)"
              value={form.clientName}
              onChange={set("clientName")}
              placeholder="e.g. Thandi"
            />
            <Field
              label="Client situation / context"
              value={form.situation}
              onChange={set("situation")}
              placeholder="e.g. First-time client, enquired last week, has not replied yet"
              textarea
            />
            <Field
              label="Important details"
              value={form.details}
              onChange={set("details")}
              placeholder="Only details you know are true — dates, times, next steps"
              textarea
            />
            <Field
              label="Desired outcome"
              value={form.outcome}
              onChange={set("outcome")}
              placeholder="e.g. They confirm the booking by Thursday"
            />

            <div>
              <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Tone
              </span>
              <div className="flex flex-wrap gap-2">
                {TONES.map((tone) => (
                  <button
                    key={tone}
                    type="button"
                    onClick={() => set("tone")(tone)}
                    className={`min-h-11 rounded-full border px-4 text-sm transition-colors ${
                      form.tone === tone
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {tone}
                  </button>
                ))}
              </div>
            </div>

            {error ? (
              <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error}
              </p>
            ) : null}

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={generate}
                disabled={loading}
                className="min-h-11 flex-1 rounded-2xl bg-primary px-6 text-sm font-medium text-primary-foreground shadow-lift transition-opacity disabled:opacity-60"
              >
                {loading ? "Generating…" : "Generate Email"}
              </button>
              <button
                type="button"
                onClick={clearAll}
                className="min-h-11 rounded-2xl border border-border px-6 text-sm font-medium"
              >
                Clear
              </button>
            </div>
          </div>
        </section>

        <section className="card-soft flex flex-col overflow-hidden p-0">
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              AI-generated draft
            </span>
            {email ? (
              <div className="flex flex-wrap gap-2">
                <SmallButton onClick={copy}>Copy</SmallButton>
                <SmallButton onClick={generate} disabled={loading}>
                  Regenerate
                </SmallButton>
                <SmallButton onClick={() => setEditing((v) => !v)}>
                  {editing ? "Preview" : "Edit"}
                </SmallButton>
                <SmallButton
                  onClick={() => {
                    setEmail(null);
                    setDraft("");
                  }}
                >
                  Clear
                </SmallButton>
              </div>
            ) : null}
          </div>

          <div className="flex-1 p-6 sm:p-8">
            {loading ? (
              <div className="space-y-4">
                <Shimmer>Drafting your email…</Shimmer>
                <div className="h-3 w-1/3 rounded bg-muted" />
                <div className="h-3 w-full rounded bg-muted" />
                <div className="h-3 w-5/6 rounded bg-muted" />
                <div className="h-3 w-2/3 rounded bg-muted" />
              </div>
            ) : !email ? (
              <p className="py-16 text-center text-sm text-muted-foreground">
                Your draft will appear here. Fill in the purpose and press Generate Email.
              </p>
            ) : editing ? (
              <label className="block">
                <span className="sr-only">Edit the generated email</span>
                <textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  className="min-h-[24rem] w-full resize-y rounded-2xl border border-border bg-background p-4 text-sm leading-relaxed focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </label>
            ) : (
              <article className="space-y-6 animate-fade-in">
                <div>
                  <p className="text-xs text-muted-foreground">Subject</p>
                  <p className="font-medium">{email.subject}</p>
                </div>
                <div className="space-y-4 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                  <p className="text-foreground">{email.greeting}</p>
                  <p>{draft ? draft.split("\n\n").slice(2, -1).join("\n\n") : email.body}</p>
                  <p className="text-foreground">{email.closing}</p>
                </div>
                {email.clarifications.length > 0 ? (
                  <div className="rounded-2xl bg-secondary/50 p-4">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary">
                      The AI needs clarification
                    </p>
                    <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                      {email.clarifications.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </article>
            )}
          </div>

          <div className="border-t border-border bg-muted/50 px-6 py-4">
            <p className="text-xs text-muted-foreground">
              Review AI-generated content before sending it to a client. Bloom &amp; Elevate AI never
              sends emails automatically.
            </p>
          </div>
        </section>
      </div>
    </AppShell>
  );
}

function SmallButton({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="rounded-full border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted disabled:opacity-50"
    >
      {children}
    </button>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  textarea,
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  textarea?: boolean;
  required?: boolean;
}) {
  const id = label.toLowerCase().replace(/[^a-z]+/g, "-");
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground"
      >
        {label}
        {required ? <span className="text-priority-high"> *</span> : null}
      </label>
      {textarea ? (
        <textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="min-h-24 w-full rounded-2xl border border-border bg-background p-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        />
      ) : (
        <input
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="min-h-11 w-full rounded-2xl border border-border bg-background px-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        />
      )}
    </div>
  );
}
