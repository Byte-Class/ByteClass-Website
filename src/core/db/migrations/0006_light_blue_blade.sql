CREATE TABLE IF NOT EXISTS "calendar" (
	"user_id " varchar NOT NULL,
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"name" varchar(50) NOT NULL,
	"description" varchar(200) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "calendar_user_id _unique" UNIQUE("user_id "),
	CONSTRAINT "calendar_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "event" (
	"calendar_id" varchar NOT NULL,
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"name" varchar(50) NOT NULL,
	"description" varchar(200) NOT NULL,
	"day" date NOT NULL,
	"time" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "event_calendar_id_unique" UNIQUE("calendar_id")
);
--> statement-breakpoint
ALTER TABLE "session" ALTER COLUMN "expires" SET NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "calendar" ADD CONSTRAINT "calendar_user_id _user_id_fk" FOREIGN KEY ("user_id ") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "event" ADD CONSTRAINT "event_calendar_id_calendar_id_fk" FOREIGN KEY ("calendar_id") REFERENCES "public"."calendar"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
