#!/bin/bash

# Create a PlantUML file from the Python codebase
pyreverse -o plantuml -p acsess_project acsess_api acsess_backend

# Convert the PlantUML file to PNG
plantuml classes_acsess_project.uml
plantuml packages_acsess_project.uml

# Move the generated PNG files to the desired location
mv classes_acsess_project.png /project
mv packages_acsess_project.png /project
