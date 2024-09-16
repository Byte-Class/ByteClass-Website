DO $$ BEGIN
 CREATE TYPE "public"."role" AS ENUM('user', 'admin');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "google_information" (
	"user_id " varchar NOT NULL,
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"access_token" text NOT NULL,
	"refresh_token" text NOT NULL,
	"scope" text NOT NULL,
	"id_token" text NOT NULL,
	"token_type" text NOT NULL,
	"expiry" integer NOT NULL,
	CONSTRAINT "google_information_user_id _unique" UNIQUE("user_id ")
);
--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "role" "role" NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "google_information" ADD CONSTRAINT "google_information_user_id _user_id_fk" FOREIGN KEY ("user_id ") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
