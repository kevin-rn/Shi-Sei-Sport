#!/bin/bash
set -e

echo "Pulling latest changes..."
git pull origin main

echo "Building images..."
docker compose build backend frontend

echo "Restarting services..."
docker compose up -d

echo "Waiting for services to be healthy..."
sleep 10

echo "Clean up old images..."
docker image prune -f

echo "Done! Judo site is updated."
echo "Frontend: http://localhost"
echo "API: http://localhost/api"
echo "Admin: http://localhost/admin"