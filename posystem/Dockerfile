# See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

# This stage is used when running from VS in fast mode (Default for Debug configuration)
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080
EXPOSE 8081


# This stage is used to build the service project
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["posystem/posystem.csproj", "posystem/"]
COPY ["posystem.Client/posystem.client.esproj", "posystem.Client/"]
COPY ["posystem.ServiceInterface/posystem.ServiceInterface.csproj", "posystem.ServiceInterface/"]
COPY ["posystem.ServiceModel/posystem.ServiceModel.csproj", "posystem.ServiceModel/"]
RUN dotnet restore "./posystem/posystem.csproj"
COPY . .
WORKDIR "/src/posystem"
RUN dotnet build "./posystem.csproj" -c $BUILD_CONFIGURATION -o /app/build

# This stage is used to publish the service project to be copied to the final stage
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./posystem.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# This stage is used in production or when running from VS in regular mode (Default when not using the Debug configuration)
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "posystem.dll"]