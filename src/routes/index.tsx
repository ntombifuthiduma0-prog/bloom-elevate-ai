import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import eventTable from "@/assets/event-table.jpg";
import {
  readActivity,
  relativeTime,
  subscribeActivity,
  type ActivityItem,
} from "@/lib/activity";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bloom & Elevate AI | Business Assistant Dashboard" },
      {
        name: "description",
        content:
          "Bloom & Elevate AI dashboard: generate client emails, plan event days and chat with your AI business assistant.",
      },
      { property: "og:title", content: "Bloom & Elevate AI | Business Assistant Dashboard" },
      {
        property: "og:description",
        content:
          "One assistant for smarter client communication, event planning and daily productivity.",
      },
    ],
  }),
  component: Dashboard,
});

const PRIORITY_TASKS = [
  { time: "08:00", task: "Confirm supplier delivery", note: "Floral installation", level: "high" },
  {
    time: "10:30",
    task: "Client check-in call",
    note: "Finalise seating for Sunday",
    level: "medium",
  },
  {
    time: "14:00",
    task: "Social media preparation",
    note: "Draft weekend highlight captions",
    level: "low",
  },
] as const;

const LEVEL_COLOR: Record<string, string> = {
  high: "bg-priority-high",
  medium: "bg-priority-medium",
  low: "bg-priority-low",
};

function Dashboard() {
  const navigate = useNavigate();
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [ask, setAsk] = useState("");

  useEffect(() => {
    setActivity(readActivity());
    return subscribeActivity(() => setActivity(readActivity()));
  }, []);

  return (
    <AppShell
      title="Welcome, Bloom & Elevate"
      subtitle="Your intelligent business assistant for smarter communication, planning and productivity."
    >
      <section className="grid gap-6 px-6 sm:px-8 md:grid-cols-2 xl:grid-cols-3">
        <div className="card-soft p-6 transition-shadow hover:shadow-lift">
          <div className="mb-4 grid h-10 w-10 place-items-center rounded-xl bg-secondary">✉️</div>
          <h3 className="mb-2 text-lg font-semibold">Create an Email</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Generate a professional, friendly client email.
          </p>
          <Link to="/email" className="text-sm font-medium text-primary">
            Open Generator →
          </Link>
        </div>

        <div className="card-soft p-6 transition-shadow hover:shadow-lift">
          <div className="mb-4 grid h-10 w-10 place-items-center rounded-xl bg-secondary">📅</div>
          <h3 className="mb-2 text-lg font-semibold">Plan My Day</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Create and prioritise tasks around Bloom &amp; Elevate events.
          </p>
          <Link to="/planner" className="text-sm font-medium text-primary">
            Open Planner →
          </Link>
        </div>

        <div className="relative overflow-hidden rounded-3xl bg-moss p-6 text-cream shadow-lift md:col-span-2 xl:col-span-1">
          <h3 className="font-display mb-2 text-xl">Ask Bloom &amp; Elevate AI</h3>
          <p className="mb-4 text-sm opacity-80">
            Interact with the AI assistant using natural language.
          </p>
          <form
            className="flex flex-col gap-2 sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault();
              navigate({
                to: "/assistant",
                search: ask.trim() ? { q: ask.trim() } : undefined,
              });
            }}
          >
            <label className="sr-only" htmlFor="dashboard-ask">
              Ask the assistant
            </label>
            <input
              id="dashboard-ask"
              value={ask}
              onChange={(e) => setAsk(e.target.value)}
              placeholder="Plan my day for Saturday's event..."
              className="w-full min-w-0 rounded-lg border border-cream/20 bg-cream/10 px-3 py-2 text-sm placeholder:text-cream/60 focus:outline-none focus:ring-1 focus:ring-sand"
            />
            <button
              type="submit"
              className="min-h-11 shrink-0 rounded-lg bg-sand px-4 py-2 text-sm font-medium text-sand-foreground"
            >
              Ask
            </button>
          </form>
        </div>
      </section>

      <div className="mt-10 grid gap-8 px-6 sm:px-8 xl:grid-cols-12">
        <div className="card-soft p-6 sm:p-8 xl:col-span-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <h3 className="font-display text-xl">Today&apos;s priority tasks</h3>
            <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium uppercase tracking-wider text-primary">
              Upcoming: Saturday · Garden Celebration
            </span>
          </div>

          <div className="space-y-4">
            {PRIORITY_TASKS.map((task) => (
              <div
                key={task.time}
                className="flex items-center gap-4 rounded-2xl border border-border bg-muted/60 p-4 sm:gap-6"
              >
                <span className="w-12 shrink-0 text-sm font-medium text-muted-foreground">
                  {task.time}
                </span>
                <div className={`h-8 w-1 shrink-0 rounded-full ${LEVEL_COLOR[task.level]}`} />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{task.task}</p>
                  <p className="truncate text-xs text-muted-foreground">{task.note}</p>
                </div>
                <Link
                  to="/planner"
                  className="shrink-0 text-xs font-medium uppercase tracking-wider text-primary"
                >
                  Plan
                </Link>
              </div>
            ))}
          </div>

          <p className="mt-6 text-xs text-muted-foreground">
            Event-hosting days are Fridays, Saturdays, Sundays and public holidays. Open the AI Task
            Planner to build a full time-blocked schedule.
          </p>
        </div>

        <div className="space-y-6 xl:col-span-4">
          <div className="rounded-3xl border border-border bg-secondary/40 p-6">
            <h4 className="mb-4 font-medium">Recent AI activity</h4>
            {activity.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No AI activity yet. Generate an email or a schedule and it will appear here.
              </p>
            ) : (
              <ul className="space-y-4">
                {activity.map((item) => (
                  <li key={item.id} className="flex gap-3 text-sm">
                    <span aria-hidden>
                      {item.icon === "email" ? "✉️" : item.icon === "planner" ? "📅" : "💬"}
                    </span>
                    <div className="min-w-0">
                      <p className="font-medium">{item.title}</p>
                      <p className="truncate text-xs text-muted-foreground">{item.detail}</p>
                    </div>
                    <span className="ml-auto shrink-0 text-[10px] text-muted-foreground">
                      {relativeTime(item.at)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <img
            src={eventTable}
            alt="Bloom & Elevate event table set with linen, candles and fresh flowers"
            width={800}
            height={600}
            loading="lazy"
            className="aspect-[4/3] w-full rounded-3xl object-cover"
          />

          <div className="rounded-3xl border border-border bg-card p-6">
            <p className="text-sm text-muted-foreground">
              Every output on this platform is AI-generated and needs your review before it reaches
              a client.{" "}
              <Link to="/responsible-ai" className="font-medium text-primary underline">
                Read our Responsible AI approach
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
