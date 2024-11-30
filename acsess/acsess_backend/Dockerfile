# Build the Python backend and install Python dependencies
FROM python:3.10-slim

# Set work directory
WORKDIR /project

# Install Python dependencies
COPY requirements.txt .
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

RUN apt-get update && apt-get install -y graphviz

# Copy the rest of the backend project
COPY . .

# Expose the port the backend runs on
EXPOSE 8000

# Command to run on backend container start
CMD ["python acsess_backend/manage.py runserver 0.0.0.0:8000 && celery -A acsess_backend --loglevel=info"]
