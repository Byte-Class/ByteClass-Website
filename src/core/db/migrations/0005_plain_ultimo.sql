CREATE TABLE IF NOT EXISTS "session" (
	"user_id " varchar NOT NULL,
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"expires" timestamp with time zone,
	CONSTRAINT "session_user_id _unique" UNIQUE("user_id ")
);
--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session" ADD CONSTRAINT "session_user_id _user_id_fk" FOREIGN KEY ("user_id ") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
