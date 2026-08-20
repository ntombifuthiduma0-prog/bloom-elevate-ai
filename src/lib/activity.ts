export type ActivityItem = {
  id: string;
  icon: "email" | "planner" | "chat";
  title: string;
  detail: string;
  at: string;
};

const KEY = "bloom-elevate-activity";
const EVENT = "bloom-activity-change";

export function readActivity(): ActivityItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as ActivityItem[]) : [];
  } catch {
    return [];
  }
}

export function logActivity(item: Omit<ActivityItem, "id" | "at">) {
  if (typeof window === "undefined") return;
  const next: ActivityItem[] = [
    { ...item, id: crypto.randomUUID(), at: new Date().toISOString() },
    ...readActivity(),
  ].slice(0, 6);
  window.localStorage.setItem(KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent(EVENT));
}

export function subscribeActivity(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

export function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.round(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}