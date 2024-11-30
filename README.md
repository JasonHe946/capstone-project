
# Installation Manual

## Installation

### 1. Clone the Repository
```sh
git clone git@github.com:unsw-cse-comp99-3900-24t1/capstone-project-3900w18bdeadlinedemons.git
cd capstone-project-3900w18bdeadlinedemons/acsess
```

### 2. Build Docker Images
```sh
docker-compose up --build
```

### 3. Run Setup Script
Once Docker is running, open another terminal in the same folder (`capstone-project-3900w18bdeadlinedemons/acsess`).
```sh
./databaseSetup.sh
```
This setup script will fill the database with default data and create a default superuser account with the following credentials:
- **Username**: `acsess`
- **Password**: `acsess`

## Usage

### Access the Application
Open your browser and navigate to `http://localhost:3000` to access the application frontend landing page. To log in to the application as an admin, use the default superuser account provided above.

### Access the Admin Backend
Open your browser and navigate to `http://localhost:8000` to access the admin backend. Use the default superuser account to log in.

### Access the documentation
Open your browser and navigate to `http://localhost:8000/swagger` or `http://localhost:8000/redis` to view the api documentation.






[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-718a45dd9cf7e7f842a935f5ebbe5719a5e09af4491e668f4dbf3b35d5cca122.svg)](https://classroom.github.com/online_ide?assignment_repo_id=15197258&assignment_repo_type=AssignmentRepo)
