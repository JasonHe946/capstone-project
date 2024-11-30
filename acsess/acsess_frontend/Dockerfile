# Build the Node.js frontend
FROM node:16 AS frontend

# Set work directory for frontend

RUN apt-get update
RUN apt-get install -y nodejs
RUN apt-get install -y npm

# Copy package.json and package-lock.json
COPY package*.json ./


# Install npm dependencies
RUN npm install


# Copy the rest of the frontend code
COPY . .


# Expose the port the frontend runs on (if needed)
EXPOSE 3000

# Command to run on frontend container start
CMD ["npm", "start"]  # Adjust this as per your frontend setup