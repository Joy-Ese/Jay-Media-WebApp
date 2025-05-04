FROM node:slim AS build

# Set working directory
WORKDIR /app

COPY JayMedia.Client/package.json JayMedia.Client/package-lock.json ./

RUN npm install

# Copy the entire Angular project
COPY JayMedia.Client/ ./

RUN npm run build --configuration=production

# Expose port 4200
EXPOSE 4200

# Start the application using ng serve
CMD ["npm", "start", "--", "--host", "0.0.0.0", "--disable-host-check", "--poll=2000"]
