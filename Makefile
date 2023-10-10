reset-db:
	docker compose down -v
	docker compose up -d db
	sleep 5
	npm run migrate

run-db:
	docker compose up -d db redis

stop-db:
	docker compose down
