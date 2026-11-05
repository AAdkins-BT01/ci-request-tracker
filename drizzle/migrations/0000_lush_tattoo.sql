CREATE TYPE "public"."priority" AS ENUM('low', 'medium', 'high', 'urgent');--> statement-breakpoint
CREATE TYPE "public"."request_status" AS ENUM('submitted', 'accepted', 'declined', 'in_progress', 'blocked', 'done');--> statement-breakpoint
CREATE TYPE "public"."request_type" AS ENUM('report', 'automation', 'sop', 'other');--> statement-breakpoint
CREATE TYPE "public"."reviewer" AS ENUM('anna', 'mike', 'keith');--> statement-breakpoint
CREATE TABLE "activity_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"request_id" uuid NOT NULL,
	"author" "reviewer" NOT NULL,
	"note" text,
	"hours_delta" numeric(6, 2),
	"status_change" text,
	"visible_to_requester" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"type" "request_type" NOT NULL,
	"priority" "priority" DEFAULT 'medium' NOT NULL,
	"needed_by" date,
	"department" text NOT NULL,
	"requester_name" text NOT NULL,
	"requester_email" text NOT NULL,
	"status" "request_status" DEFAULT 'submitted' NOT NULL,
	"decline_reason" text,
	"owner" "reviewer",
	"percent_complete" integer DEFAULT 0 NOT NULL,
	"total_hours" numeric(6, 2) DEFAULT '0' NOT NULL,
	"location_note" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"accepted_at" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "activity_log" ADD CONSTRAINT "activity_log_request_id_requests_id_fk" FOREIGN KEY ("request_id") REFERENCES "public"."requests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "activity_log_request_id_idx" ON "activity_log" USING btree ("request_id");--> statement-breakpoint
CREATE INDEX "requests_status_idx" ON "requests" USING btree ("status");--> statement-breakpoint
CREATE INDEX "requests_type_idx" ON "requests" USING btree ("type");--> statement-breakpoint
CREATE INDEX "requests_department_idx" ON "requests" USING btree ("department");--> statement-breakpoint
CREATE INDEX "requests_owner_idx" ON "requests" USING btree ("owner");--> statement-breakpoint
CREATE INDEX "requests_priority_idx" ON "requests" USING btree ("priority");