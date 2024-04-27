run:
	npm run start:dev

migrate:
	npm run knex migrate:latest

reset-db:
	docker compose down -v
	docker compose up -d db redis minio -d
	sleep 5
	npm run migrate

run-db:
	docker compose up db redis minio -d
