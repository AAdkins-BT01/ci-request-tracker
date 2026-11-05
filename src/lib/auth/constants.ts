export const REVIEWERS = ["anna", "mike", "keith"] as const;
export type Reviewer = (typeof REVIEWERS)[number];

export const REVIEWER_LABELS: Record<Reviewer, string> = {
  anna: "Anna",
  mike: "Mike",
  keith: "Keith",
};

export function isReviewer(value: string): value is Reviewer {
  return (REVIEWERS as readonly string[]).includes(value);
}
