import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { generateSchedule, type GeneratedSchedule } from "@/lib/ai.functions";
import { logActivity } from "@/lib/activity";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner | Bloom & Elevate AI" },
      {
        name: "description",
        content:
          "Prioritise Bloom & Elevate tasks and build a realistic, time-blocked schedule around Friday to Sunday events.",
      },
      { property: "og:title", content: "AI Task Planner | Bloom & Elevate AI" },
      {
        property: "og:description",
        content: "Turn your task list into a prioritised event-day schedule.",
      },
    ],
  }),
  component: Planner,
});

type Task = {
  id: string;
  name: string;
  deadline: string;
  duration: string;
  priority: string;
  status: string;
};

const newTask = (): Task => ({
  id: crypto.randomUUID(),
  name: "",
  deadline: "",
  duration: "",
  priority: "medium",
  status: "not started",
});

const PRIORITY_STYLE: Record<string, string> = {
  high: "bg-priority-high/15 text-foreground",
  medium: "bg-priority-medium/20 text-foreground",
  low: "bg-priority-low/20 text-foreground",
};

const PRIORITY_DOT: Record<string, string> = {
  high: "bg-priority-high",
  medium: "bg-priority-medium",
  low: "bg-priority-low",
};

const PRIORITY_LABEL: Record<string, string> = {
  high: "🔴 High",
  medium: "🟡 Medium",
  low: "🟢 Low",
};

function Planner() {
  const runSchedule = useServerFn(generateSchedule);
  const [event, setEvent] = useState({
    eventDate: "",
    eventType: "",
    startTime: "",
    endTime: "",
    eventCount: "1",
    notes: "",
  });
  const [tasks, setTasks] = useState<Task[]>([newTask()]);
  const [schedule, setSchedule] = useState<GeneratedSchedule | null>(null);
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateTask = (id: string, patch: Partial<Task>) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));

  async function generate() {
    if (!tasks.some((t) => t.name.trim())) {
      setError("Add at least one task before generating a schedule.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await runSchedule({
        data: {
          ...event,
          tasks: tasks
            .filter((t) => t.name.trim())
            .map(({ name, deadline, duration, priority, status }) => ({
              name,
              deadline,
              duration,
              priority,
              status,
            })),
        },
      });
      setSchedule(result);
      setDone({});
      logActivity({
        icon: "planner",
        title: "Schedule generated",
        detail: `${result.blocks.length} time blocks${event.eventType ? ` · ${event.eventType}` : ""}`,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function clearAll() {
    setEvent({
      eventDate: "",
      eventType: "",
      startTime: "",
      endTime: "",
      eventCount: "1",
      notes: "",
    });
    setTasks([newTask()]);
    setSchedule(null);
    setDone({});
    setError(null);
  }

  return (
    <AppShell
      title="AI Task Planner"
      subtitle="Prioritise your work around Friday, Saturday, Sunday and public-holiday events."
    >
      <div className="grid gap-8 px-6 pb-4 sm:px-8 xl:grid-cols-12">
        <section className="card-soft p-6 sm:p-8 xl:col-span-5">
          <h3 className="font-display mb-6 text-xl">Event details</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Event date"
              type="date"
              value={event.eventDate}
              onChange={(v) => setEvent({ ...event, eventDate: v })}
            />
            <Input
              label="Event type"
              value={event.eventType}
              onChange={(v) => setEvent({ ...event, eventType: v })}
              placeholder="Garden celebration"
            />
            <Input
              label="Start time"
              type="time"
              value={event.startTime}
              onChange={(v) => setEvent({ ...event, startTime: v })}
            />
            <Input
              label="End time"
              type="time"
              value={event.endTime}
              onChange={(v) => setEvent({ ...event, endTime: v })}
            />
            <Input
              label="Number of events"
              type="number"
              value={event.eventCount}
              onChange={(v) => setEvent({ ...event, eventCount: v })}
            />
          </div>
          <div className="mt-4">
            <label
              htmlFor="planner-notes"
              className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              Additional notes
            </label>
            <textarea
              id="planner-notes"
              value={event.notes}
              onChange={(e) => setEvent({ ...event, notes: e.target.value })}
              placeholder="Supplier arriving late, venue access from 07:00…"
              className="min-h-24 w-full rounded-2xl border border-border bg-background p-4 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>

          <h3 className="font-display mb-4 mt-8 text-xl">Tasks</h3>
          <div className="space-y-4">
            {tasks.map((task, index) => (
              <div key={task.id} className="rounded-2xl border border-border bg-muted/40 p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Task {index + 1}
                  </span>
                  {tasks.length > 1 ? (
                    <button
                      type="button"
                      onClick={() => setTasks((prev) => prev.filter((t) => t.id !== task.id))}
                      className="text-xs text-muted-foreground underline"
                    >
                      Remove
                    </button>
                  ) : null}
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Input
                    label="Task name"
                    value={task.name}
                    onChange={(v) => updateTask(task.id, { name: v })}
                    placeholder="Confirm supplier"
                  />
                  <Input
                    label="Deadline"
                    value={task.deadline}
                    onChange={(v) => updateTask(task.id, { deadline: v })}
                    placeholder="Friday 12:00"
                  />
                  <Input
                    label="Estimated duration"
                    value={task.duration}
                    onChange={(v) => updateTask(task.id, { duration: v })}
                    placeholder="30 min"
                  />
                  <Select
                    label="Priority"
                    value={task.priority}
                    onChange={(v) => updateTask(task.id, { priority: v })}
                    options={["high", "medium", "low"]}
                  />
                  <Select
                    label="Status"
                    value={task.status}
                    onChange={(v) => updateTask(task.id, { status: v })}
                    options={["not started", "in progress", "blocked", "complete"]}
                  />
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setTasks((prev) => [...prev, newTask()])}
            className="mt-4 min-h-11 w-full rounded-2xl border border-dashed border-border text-sm font-medium text-muted-foreground"
          >
            + Add task
          </button>

          {error ? (
            <p className="mt-4 rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </p>
          ) : null}

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={generate}
              disabled={loading}
              className="min-h-11 flex-1 rounded-2xl bg-primary px-6 text-sm font-medium text-primary-foreground shadow-lift disabled:opacity-60"
            >
              {loading ? "Building schedule…" : "Generate Schedule"}
            </button>
            <button
              type="button"
              onClick={clearAll}
              className="min-h-11 rounded-2xl border border-border px-6 text-sm font-medium"
            >
              Clear
            </button>
          </div>
        </section>

        <section className="space-y-6 xl:col-span-7">
          <div className="card-soft p-6 sm:p-8">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <h3 className="font-display text-xl">AI-generated schedule</h3>
              {schedule ? (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={generate}
                    disabled={loading}
                    className="rounded-full border border-border px-3 py-1.5 text-xs font-medium disabled:opacity-50"
                  >
                    Regenerate
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      const text = schedule.blocks
                        .map((b) => `${b.time} — ${b.task} — ${b.priority.toUpperCase()}`)
                        .join("\n");
                      try {
                        await navigator.clipboard.writeText(text);
                        toast.success("Schedule copied.");
                      } catch {
                        toast.error("Could not copy the schedule.");
                      }
                    }}
                    className="rounded-full border border-border px-3 py-1.5 text-xs font-medium"
                  >
                    Copy
                  </button>
                  <button
                    type="button"
                    onClick={() => setSchedule(null)}
                    className="rounded-full border border-border px-3 py-1.5 text-xs font-medium"
                  >
                    Clear
                  </button>
                </div>
              ) : null}
            </div>

            {loading ? (
              <div className="space-y-3">
                <Shimmer>Prioritising your tasks…</Shimmer>
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="h-14 rounded-2xl bg-muted" />
                ))}
              </div>
            ) : !schedule ? (
              <p className="py-16 text-center text-sm text-muted-foreground">
                Add your event details and tasks, then generate a prioritised, time-blocked day.
              </p>
            ) : (
              <div className="animate-fade-in space-y-6">
                {schedule.summary ? (
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {schedule.summary}
                  </p>
                ) : null}

                <ol className="space-y-3">
                  {schedule.blocks.map((block, i) => {
                    const key = `${block.time}-${i}`;
                    const complete = done[key];
                    return (
                      <li
                        key={key}
                        className={`flex flex-wrap items-center gap-3 rounded-2xl border border-border p-4 sm:gap-5 ${
                          complete ? "opacity-60" : ""
                        } ${PRIORITY_STYLE[block.priority]}`}
                      >
                        <span className="w-14 shrink-0 text-sm font-medium">{block.time}</span>
                        <span
                          className={`h-8 w-1 shrink-0 rounded-full ${PRIORITY_DOT[block.priority]}`}
                        />
                        <div className="min-w-0 flex-1">
                          <p className={`font-medium ${complete ? "line-through" : ""}`}>
                            {block.task}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {[PRIORITY_LABEL[block.priority], block.duration, block.note]
                              .filter(Boolean)
                              .join(" · ")}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setDone((prev) => ({ ...prev, [key]: !prev[key] }))}
                          className="min-h-11 shrink-0 rounded-full border border-border px-3 text-xs font-medium"
                        >
                          {complete ? "Undo" : "Mark complete"}
                        </button>
                      </li>
                    );
                  })}
                </ol>

                {schedule.beforeEvent.length > 0 ? (
                  <div className="rounded-2xl bg-secondary/50 p-4">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary">
                      Complete before the event
                    </p>
                    <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                      {schedule.beforeEvent.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {schedule.conflicts.length > 0 ? (
                  <div className="rounded-2xl border border-priority-high/40 p-4">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-priority-high">
                      Potential conflicts
                    </p>
                    <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                      {schedule.conflicts.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                <p className="text-xs text-muted-foreground">
                  AI-generated schedule — review timings against your real commitments before
                  relying on it.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </AppShell>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  const id = `${label.toLowerCase().replace(/[^a-z]+/g, "-")}-${type}`;
  return (
    <div className="min-w-0">
      <label
        htmlFor={id}
        className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-11 w-full rounded-2xl border border-border bg-background px-4 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
      />
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  const id = `${label.toLowerCase()}-${options[0]}`;
  return (
    <div className="min-w-0">
      <label
        htmlFor={id}
        className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground"
      >
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-11 w-full rounded-2xl border border-border bg-background px-4 text-sm capitalize focus:outline-none focus:ring-1 focus:ring-ring"
      >
        {options.map((option) => (
          <option key={option} value={option} className="capitalize">
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
