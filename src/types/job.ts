export const STAGES = [
  "Not Applied",
  "Applied",
  "Resume Passed",
  "Assignment/Test",
  "1st Interview",
  "2nd Interview",
  "Final Interview",
  "Accepted",
  "Rejected",
  "On Hold",
] as const;

export type Stage = (typeof STAGES)[number];

export const TERMINAL_STAGES: Stage[] = ["Accepted", "Rejected", "On Hold"];

export interface JobApplication {
  id: string;
  company: string;
  site: string;
  salary: string;
  position: string;
  location: string;
  stage: Stage;
  memo: string;
  appliedAt: string;
  updatedAt: string;
  source?: string;
  sourceJobId?: string | null;
}

export type JobFormData = Omit<JobApplication, "id" | "updatedAt">;

export function todayAppliedAt(): string {
  const now = new Date();
  return new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  ).toISOString();
}

export function toDateInputValue(iso: string): string {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function fromDateInputValue(date: string): string {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(y, m - 1, d).toISOString();
}

export const EMPTY_FORM: JobFormData = {
  company: "",
  site: "",
  salary: "",
  position: "",
  location: "",
  stage: "Not Applied",
  memo: "",
  appliedAt: todayAppliedAt(),
};
