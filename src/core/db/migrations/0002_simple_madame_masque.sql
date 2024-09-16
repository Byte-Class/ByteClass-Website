ALTER TABLE "google_information" RENAME COLUMN "expiry" TO "expiry_date";--> statement-breakpoint
ALTER TABLE "google_information" ALTER COLUMN "expiry_date" SET DATA TYPE bigint;