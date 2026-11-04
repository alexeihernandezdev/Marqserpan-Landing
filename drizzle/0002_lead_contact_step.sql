ALTER TABLE "leads" ALTER COLUMN "type" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "leads" ALTER COLUMN "message" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "leads" ADD COLUMN "completed_at" timestamp with time zone;--> statement-breakpoint
-- Las solicitudes anteriores ya estaban completas.
UPDATE "leads" SET "completed_at" = "created_at" WHERE "completed_at" IS NULL;
