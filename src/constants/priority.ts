
export const PRIORITY_ORDER: Record<string, number> = {
  Cao: 0,
  high: 0,
  Vừa: 1,
  medium: 1,
  Thấp: 2,
  low: 2,
};

export const PRIORITY_LEVELS = {
  HIGH: "Cao",
  MEDIUM: "Vừa",
  LOW: "Thấp",
} as const;

export type PriorityLevel =
  (typeof PRIORITY_LEVELS)[keyof typeof PRIORITY_LEVELS];
