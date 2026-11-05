import {
  pgEnum,
  pgTable,
  uuid,
  text,
  integer,
  numeric,
  boolean,
  date,
  timestamp,
  index,
} from "drizzle-orm/pg-core";

export const requestTypeEnum = pgEnum("request_type", [
  "report",
  "automation",
  "sop",
  "other",
]);

export const priorityEnum = pgEnum("priority", [
  "low",
  "medium",
  "high",
  "urgent",
]);

export const requestStatusEnum = pgEnum("request_status", [
  "submitted",
  "accepted",
  "declined",
  "in_progress",
  "blocked",
  "done",
]);

export const reviewerEnum = pgEnum("reviewer", ["anna", "mike", "keith"]);

export const requests = pgTable(
  "requests",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    type: requestTypeEnum("type").notNull(),
    priority: priorityEnum("priority").notNull().default("medium"),
    neededBy: date("needed_by"),
    department: text("department").notNull(),
    requesterName: text("requester_name").notNull(),
    requesterEmail: text("requester_email").notNull(),
    status: requestStatusEnum("status").notNull().default("submitted"),
    declineReason: text("decline_reason"),
    owner: reviewerEnum("owner"),
    percentComplete: integer("percent_complete").notNull().default(0),
    totalHours: numeric("total_hours", { precision: 6, scale: 2 })
      .notNull()
      .default("0"),
    locationNote: text("location_note"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    acceptedAt: timestamp("accepted_at", { withTimezone: true }),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("requests_status_idx").on(table.status),
    index("requests_type_idx").on(table.type),
    index("requests_department_idx").on(table.department),
    index("requests_owner_idx").on(table.owner),
    index("requests_priority_idx").on(table.priority),
  ],
);

export const activityLog = pgTable(
  "activity_log",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    requestId: uuid("request_id")
      .notNull()
      .references(() => requests.id, { onDelete: "cascade" }),
    author: reviewerEnum("author").notNull(),
    note: text("note"),
    hoursDelta: numeric("hours_delta", { precision: 6, scale: 2 }),
    statusChange: text("status_change"),
    visibleToRequester: boolean("visible_to_requester").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("activity_log_request_id_idx").on(table.requestId)],
);

export type Request = typeof requests.$inferSelect;
export type NewRequest = typeof requests.$inferInsert;
export type ActivityLogEntry = typeof activityLog.$inferSelect;
export type NewActivityLogEntry = typeof activityLog.$inferInsert;
