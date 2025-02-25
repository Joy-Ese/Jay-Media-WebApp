FROM node:20-alpine AS build
WORKDIR /app

COPY JayMedia.Client/package.json JayMedia.Client/package-lock.json ./

RUN npm install

# Copy the entire Angular project
COPY JayMedia.Client ./

# Switch to the correct Angular workspace directory
WORKDIR /app

COPY . .
RUN npm run build --configuration=production


FROM nginx:alpine
COPY --from=build /app/dist/jay-media.client /usr/share/nginx/html
EXPOSE 4200
CMD ["nginx", "-g", "daemon off;"]
