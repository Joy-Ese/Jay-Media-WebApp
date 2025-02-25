FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 5090
EXPOSE 7000

ENV ASPNETCORE_URLS=http://+:5090

# Build stage
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
ARG configuration=Release
WORKDIR /src

# Copy the project file and restore dependencies
COPY JayMedia.Api/JayMedia.Api.csproj backend/JayMedia.Api/
WORKDIR /src/backend/JayMedia.Api
RUN dotnet restore "JayMedia.Api.csproj"

# Copy the entire project and build the app
COPY backend/JayMedia.Api backend/JayMedia.Api/
WORKDIR /src/backend/JayMedia.Api
RUN dotnet build "JayMedia.Api.csproj" -c $configuration -o /app/build

# Publish the build
FROM build AS publish
ARG configuration=Debug
RUN dotnet publish "JayMedia.Api.csproj" -c $configuration -o /app/publish /p:UseAppHost=false

# Runtime stage
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "JayMedia.Api.dll"]
