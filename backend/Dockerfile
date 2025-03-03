FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 5090
EXPOSE 7000

ENV ASPNETCORE_URLS=http://+:5090

# Build stage
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
ARG configuration=Release
WORKDIR /app

# Copy the entire solution and project file and restore dependencies
COPY JayMedia.Api/JayMedia.Api.csproj JayMedia.Api/
COPY JayMedia.Data/JayMedia.Data.csproj JayMedia.Data/
COPY JayMedia.Models/JayMedia.Models.csproj JayMedia.Models/
COPY JayMedia.Services/JayMedia.Services.csproj JayMedia.Services/
RUN dotnet restore JayMedia.Api/JayMedia.Api.csproj


# Copy the entire project and build the app
COPY . .
RUN dotnet build JayMedia.Api/JayMedia.Api.csproj -c $configuration -o /app/build

# Publish the build
FROM build AS publish
ARG configuration=Release
RUN dotnet publish JayMedia.Api/JayMedia.Api.csproj -c $configuration -o /app/publish /p:UseAppHost=false

# Runtime stage
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "JayMedia.Api.dll"]
