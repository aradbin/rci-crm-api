.PHONY: reset-db

reset-db:
	docker compose down -v
	docker compose up -d db
	# npm run migrate
