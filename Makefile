dev:
	@pnpm run dev

generate:
	@pnpm db:generate

migrate:
	@pnpm db:migrate

migrate_drop:
	@pnpm drizzle-kit drop
