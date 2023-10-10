.PHONY: reset-db

reset-db:
	docker compose down -v
	docker compose up -d db
	sleep 5
	npm run migrate
