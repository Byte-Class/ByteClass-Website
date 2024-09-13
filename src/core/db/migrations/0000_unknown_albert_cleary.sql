CREATE TABLE IF NOT EXISTS "user" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"image" text NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
