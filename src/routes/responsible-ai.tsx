import { Link, createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";

export const Route = createFileRoute("/responsible-ai")({
  head: () => ({
    meta: [
      { title: "Responsible AI | Bloom & Elevate AI" },
      {
        name: "description",
        content:
          "How Bloom & Elevate uses AI responsibly: human review, privacy, transparency and clear limitations.",
      },
      { property: "og:title", content: "Responsible AI | Bloom & Elevate AI" },
      {
        property: "og:description",
        content: "Our principles for human oversight, privacy and transparency in AI use.",
      },
    ],
  }),
  component: ResponsibleAi,
});

const PRINCIPLES = [
  {
    title: "Human oversight",
    body: "Every email, schedule and answer is a draft. A person at Bloom & Elevate reviews and approves it before a client ever sees it. The assistant never sends, books or commits to anything on your behalf.",
  },
  {
    title: "Privacy and confidentiality",
    body: "Share only the details needed for the task. Avoid pasting identity numbers, payment details or private information about clients. Nothing you enter is used to train the underlying model.",
  },
  {
    title: "Transparency",
    body: "AI-generated content is labelled throughout the platform, and the assistant flags when it is unsure or needs more information rather than inventing details.",
  },
  {
    title: "Accuracy and limitations",
    body: "The assistant can be wrong about dates, prices, availability and supplier details. It does not have access to your calendar, inbox or booking system, so verify facts before relying on them.",
  },
  {
    title: "Fairness and tone",
    body: "Outputs follow the Bloom & Elevate voice: warm, respectful and inclusive. Report anything that feels off-brand or biased so the prompts can be improved.",
  },
  {
    title: "Accountability",
    body: "Responsibility for client communication always stays with the Bloom & Elevate team. AI supports the work; it does not replace judgement.",
  },
];

const PRACTICES = [
  "Read every draft end to end before sending it.",
  "Correct names, dates, times and prices manually — do not assume they are right.",
  "Keep confidential client information out of prompts.",
  "Use the planner as a starting point, then adjust it to real commitments.",
  "Tell a colleague when a client-facing message was AI-assisted, if it matters.",
];

function ResponsibleAi() {
  return (
    <AppShell
      title="Responsible AI"
      subtitle="How Bloom & Elevate uses AI thoughtfully, transparently and with people in charge."
    >
      <div className="px-6 pb-4 sm:px-8">
        <section className="rounded-3xl bg-moss p-8 text-cream shadow-lift sm:p-10">
          <p className="text-xs uppercase tracking-[0.2em] opacity-80">Our commitment</p>
          <h3 className="font-display mt-3 max-w-2xl text-2xl leading-snug sm:text-3xl">
            AI helps us work faster. People make sure the work is right.
          </h3>
        </section>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {PRINCIPLES.map((principle) => (
            <article key={principle.title} className="card-soft p-6 sm:p-8">
              <h4 className="mb-3 text-lg font-semibold">{principle.title}</h4>
              <p className="text-sm leading-relaxed text-muted-foreground">{principle.body}</p>
            </article>
          ))}
        </div>

        <section className="card-soft mt-8 p-6 sm:p-8">
          <h4 className="font-display mb-4 text-xl">Everyday practices</h4>
          <ul className="space-y-3">
            {PRACTICES.map((item) => (
              <li key={item} className="flex gap-3 text-sm text-muted-foreground">
                <span aria-hidden className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-8 rounded-3xl border border-border bg-secondary/40 p-6 sm:p-8">
          <p className="text-sm text-muted-foreground">
            Ready to put this into practice?{" "}
            <Link to="/email" className="font-medium text-primary underline">
              Open the Smart Email Generator
            </Link>{" "}
            or{" "}
            <Link to="/planner" className="font-medium text-primary underline">
              plan your event day
            </Link>
            .
          </p>
        </section>
      </div>
    </AppShell>
  );
}
