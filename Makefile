# BankerOS — One-stop developer commands

.PHONY: help install dev build test lint clean
.PHONY: db-up db-down db-migrate db-seed db-reset db-studio
.PHONY: docker-build docker-up docker-down docker-logs
.PHONY: helm-install helm-upgrade helm-uninstall
.PHONY: e2e openapi typecheck

# Default target — show help
help:
	@echo "BankerOS Development Commands"
	@echo "============================="
	@echo ""
	@echo "Setup & dependencies"
	@echo "  install         Install all pnpm dependencies"
	@echo "  db-up           Start infrastructure (postgres, redis, kafka)"
	@echo "  db-migrate      Apply Prisma migrations"
	@echo "  db-seed         Seed initial GL accounts + admin user"
	@echo "  db-reset        Reset database (CAUTION: destroys data)"
	@echo ""
	@echo "Development"
	@echo "  dev             Start all microservices + dashboard in parallel"
	@echo "  dev-backend     Start only backend services (no dashboard)"
	@echo "  dev-dashboard   Start only the React dashboard"
	@echo "  build           Build all packages and services"
	@echo "  typecheck       Run TypeScript checks across all packages"
	@echo ""
	@echo "Testing"
	@echo "  test            Run all unit tests"
	@echo "  test-coverage   Run tests with coverage report"
	@echo "  e2e             Run Playwright end-to-end tests"
	@echo "  lint            Run linter across all packages"
	@echo ""
	@echo "Docker"
	@echo "  docker-build    Build all service images"
	@echo "  docker-up       Start full stack via docker-compose"
	@echo "  docker-down     Stop and remove all containers"
	@echo "  docker-logs     Tail logs from all containers"
	@echo ""
	@echo "Kubernetes / Helm"
	@echo "  helm-install    Install BankerOS chart to current cluster"
	@echo "  helm-upgrade    Upgrade existing release"
	@echo "  helm-uninstall  Remove all BankerOS resources"

# ───────────────────────────────────────────────────────────────────────────
# Setup
# ───────────────────────────────────────────────────────────────────────────

install:
	pnpm install

db-up:
	docker-compose up -d postgres redis zookeeper kafka

db-down:
	docker-compose stop postgres redis kafka zookeeper

db-migrate:
	pnpm --filter @bankeros/database db:generate
	pnpm --filter @bankeros/database db:migrate

db-seed:
	pnpm --filter @bankeros/database db:seed

db-reset:
	@echo "⚠️  This will destroy all data. Press Ctrl+C to cancel..."
	@sleep 3
	docker-compose down -v
	docker-compose up -d postgres
	@sleep 5
	$(MAKE) db-migrate
	$(MAKE) db-seed

db-studio:
	pnpm --filter @bankeros/database db:studio

# ───────────────────────────────────────────────────────────────────────────
# Development
# ───────────────────────────────────────────────────────────────────────────

dev:
	pnpm dev

dev-backend:
	pnpm --filter='./apps/!(admin-dashboard)/**' --parallel dev

dev-dashboard:
	pnpm --filter @bankeros/admin-dashboard dev

build:
	pnpm --filter @bankeros/shared-types build
	pnpm --filter @bankeros/shared-utils build
	pnpm --filter @bankeros/database db:generate
	pnpm -r --filter='./apps/*' build

typecheck:
	pnpm -r --filter='./apps/*' exec tsc --noEmit

# ───────────────────────────────────────────────────────────────────────────
# Testing
# ───────────────────────────────────────────────────────────────────────────

test:
	pnpm -r test --passWithNoTests

test-coverage:
	pnpm -r test:coverage --passWithNoTests

e2e:
	cd apps/admin-dashboard && pnpm exec playwright install --with-deps chromium
	cd apps/admin-dashboard && pnpm exec playwright test

lint:
	pnpm -r lint --passWithNoTests

# ───────────────────────────────────────────────────────────────────────────
# Docker
# ───────────────────────────────────────────────────────────────────────────

docker-build:
	docker-compose build --parallel

docker-up:
	docker-compose up -d
	@echo "Services starting..."
	@echo "  API Gateway:    http://localhost:3000"
	@echo "  Swagger UI:     http://localhost:3000/documentation"
	@echo "  Admin Dashboard: http://localhost:5200"

docker-down:
	docker-compose down

docker-logs:
	docker-compose logs -f --tail=100

docker-status:
	@docker-compose ps

# ───────────────────────────────────────────────────────────────────────────
# Helm / Kubernetes
# ───────────────────────────────────────────────────────────────────────────

helm-install:
	helm dependency update infrastructure/helm
	helm install bankeros infrastructure/helm \
		--namespace bankeros \
		--create-namespace \
		--values infrastructure/helm/values.yaml \
		--wait

helm-install-staging:
	helm dependency update infrastructure/helm
	helm install bankeros infrastructure/helm \
		--namespace bankeros-staging \
		--create-namespace \
		--values infrastructure/helm/values-staging.yaml \
		--wait

helm-upgrade:
	helm upgrade bankeros infrastructure/helm \
		--namespace bankeros \
		--values infrastructure/helm/values.yaml \
		--wait

helm-uninstall:
	helm uninstall bankeros --namespace bankeros

helm-template:
	helm template bankeros infrastructure/helm > /tmp/bankeros-rendered.yaml
	@echo "Rendered manifests: /tmp/bankeros-rendered.yaml"

# ───────────────────────────────────────────────────────────────────────────
# Utilities
# ───────────────────────────────────────────────────────────────────────────

openapi:
	@curl -s http://localhost:3000/documentation/json > openapi.json
	@echo "OpenAPI spec exported to ./openapi.json"

clean:
	pnpm -r exec rm -rf dist node_modules .turbo coverage
	rm -rf node_modules
	@echo "Clean complete."

prisma-format:
	pnpm --filter @bankeros/database exec prisma format
