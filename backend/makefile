#!/bin/bash

NETWORK_NAME=local-network
NETWORK_ID=$(shell docker network ls -qf "name=${NETWORK_NAME}")

CONTAINER_MYSQL = local-mysql
CONTAINER_BACKEND = ems-api

DATABASE = ems_db

.PHONY: setup
setup: clean add-network create.env.file build up logs

create.env.file:
	cp .env.example .env;

.PHONY: add-network
add-network:
	@if [ -n '${NETWORK_ID}' ]; then \
		echo 'The ${NETWORK_NAME} network already exists. Skipping...'; \
	else \
		docker network create -d bridge ${NETWORK_NAME}; \
	fi

.PHONY: build
build:
	docker compose build
.PHONY: up
up:
	docker compose up --remove-orphans -d
	docker compose logs -f
.PHONY: down
down:
	docker compose down
.PHONY: logs
logs:
	docker compose logs -f
rerun: down up

reset:
	docker compose down --rmi all --volumes

.PHONY:
clean: down
	sudo rm -rf dist/
	sudo rm -rf node_modules/
	sudo rm -rf coverage/

migration.drop.mysql:
	docker exec -it ${CONTAINER_MYSQL} mysql -uroot -ppassword -e "DROP DATABASE IF EXISTS ${DATABASE}; CREATE DATABASE ${DATABASE};"

migration.drop.sqlite:
	rm -rf ems_db.sqlite

migration.generate:
	npm run migration:generate ./src/database/migrations/$(name)
migration.run:
	npm run migration:run
migration.revert:
	npm run migration:revert

seed.generate:
	npm run seed:generate ./src/database/seeds/$(name)
seed.run:
	npm run seed:run
seed.revert:
	npm run seed:revert

bash:
	docker exec -it ${CONTAINER_BACKEND} /bin/bash