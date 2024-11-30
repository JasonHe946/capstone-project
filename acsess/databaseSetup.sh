#!/bin/bash

echo "Running migrations..."
docker-compose exec backend python3 manage.py makemigrations
docker-compose exec backend python3 manage.py migrate


echo "Truncating tables..."
docker-compose exec backend python3 manage.py truncate_tables



echo "Populating rooms..."
docker-compose exec backend python3 manage.py populate_rooms

echo "Populating hotdesks..."
docker-compose exec backend python3 manage.py populate_hotdesks

echo "Importing data..."
docker-compose exec backend python3 manage.py import_data /project/acsess_data/excel/cse_staff.xlsx /project/acsess_data/excel/hdr_student.xlsx

echo "Creating Superuser..."
docker-compose exec backend python3 manage.py create_superuser

echo "Database setup complete."