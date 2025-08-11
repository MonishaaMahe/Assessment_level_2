@echo off
echo Starting PostgreSQL with Docker...
docker-compose up -d
echo PostgreSQL is running on localhost:5432
echo Database: project_management
echo Username: postgres
echo Password: password