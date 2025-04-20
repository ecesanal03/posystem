# Project Structure

This project consists of five main sub-projects:

- posystem (Main entry point)
- posystem.Client (Frontend)
- posystem.ServiceInterface (Backend logic and services)
- posystem.ServiceModel (Data models and DTOs)
- posystem.Tests (Unit testing)

In C#, referencing a project means linking one project to another within a solution, allowing the referencing project to access the code, classes, and methods of the referenced project.

# posystem
- This serves as the starting project when the application is executed.
- It acts as the root of the project and contains the solution configuration.
- Responsibilities include:
  * Configuring application startup logic.
  * Managing dependency injection and middleware.
  * Setting up database connections (if applicable).
  * Defining the Dockerfile for containerization and deployment.
  * Referencing all other sub-projects (posystem.Client, posystem.ServiceInterface, etc.).

Note: This project does not contain actual frontend or backend code but instead acts as the glue that ties everything together.

# posystem.Client
- This project contains all frontend-related logic and UI components.
- This is where the UI will be built.
- Responsibilities:
  * Communicating with the backend via APIs.
  * Handling user interactions.
  * Displaying data retrieved from the backend.
  * Sending user inputs to the backend for processing.

# posystem.ServiceInterface
- This project is responsible for handling the business logic of the application.
- It serves as the API layer that communicates between the frontend (posystem.Client) and the database models (posystem.ServiceModel).
- Responsibilities:
  * Implementing business logic and functionalities.
  * Exposing RESTful for frontend interaction.
  * Processing and validating requests from the client.
  * Interacting with posystem.ServiceModel to fetch and manipulate data.

📌 Key Notes:
- This project references posystem.ServiceModel, meaning it has access to data models without needing to make direct queries to the database.
- API controllers are typically defined here (e.g., using ASP.NET Core Web API).

# posystem.ServiceModel
- This project is dedicated to data handling and serves as the data access layer.
- It contains:
  * Data Transfer Objects (DTOs): Used to transfer data efficiently transfer between posystem.ServiceModel (data layer) and posystem.ServiceInterface (backend/business logic).
  * Entity Models: Defines the structure of the database tables.
  * Repositories: Handles queries to the database (if using Repository Pattern).
  * Mappers: Used to transform raw database data into structured objects (e.g., AutoMapper).

📌 Why use DTOs here?
1. Prevent Direct Database Access from Business Logic
- posystem.ServiceInterface does not directly fetch data from the database.
- Instead, it requests data from posystem.ServiceModel, which fetches the required data and returns DTOs.
- This ensures that the backend only receives necessary and processed data.

2. Enhance Security & Performance
- Sensitive fields (like passwords) are omitted before sending data from posystem.ServiceModel to posystem.ServiceInterface.
- DTOs help avoid unnecessary data fetching, improving API efficiency.

# posystem.Test
- This project contains unit tests and integration tests to ensure application stability.
- Responsibilities:
  * Testing business logic in posystem.ServiceInterface.
  * Validating API responses.
  * Ensuring data consistency in posystem.ServiceModel.
  * Performing mock tests for external dependencies.

📌 Commonly Used Testing Frameworks:
- xUnit or NUnit for unit testing.
- Moq for mocking dependencies.
- FluentAssertions for better test readability.


# How to run
### First, ensure that you have installed all necessary dependencies. 
Install .NET 8.0. Please follow this link: https://learn.microsoft.com/en-us/dotnet/core/install/. Select your operating system and follow the installation guide.

Install Node.JS through this link: https://nodejs.org/en/download and select your system's appropriate configuration and follow the installation guide. 

After installing Node.js, please install the Material UI package library by running this command in terminal:
```
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material
```


Since the backend and the frontend are not connected we have to run them seperately. 

Note: Please make sure to run these commands in the order provided below.

- In one terminal, run the commands below to run the frontend:
```
cd posystem.Client
npm run dev
```

- In separate terminal (while keeping the other active), run the commands below to run the backend:
```
cd posystem
dotnet build
dotnet run 
```
