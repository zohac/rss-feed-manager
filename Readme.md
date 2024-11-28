# RSS Feed Manager

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node.js](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen.svg)
![TypeScript](https://img.shields.io/badge/typescript-%3E%3D5.7.0-blue.svg)

## Table of Contents

- [Description](#description)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Configuration](#configuration)
    - [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
    - [Endpoints](#endpoints)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Description

**RSS Feed Manager** is a RESTful API built with Node.js and TypeScript, designed to manage RSS feeds and organize them into collections. Leveraging Clean Architecture principles, the application ensures a modular, maintainable, and scalable codebase. The API uses SQLite as the database, managed through TypeORM, and includes comprehensive API documentation via Swagger.

## Features

- **CRUD Operations for RSS Feeds:** Create, Read, Update, and Delete RSS feeds.
- **CRUD Operations for Collections:** Organize RSS feeds into collections for better management.
- **Data Validation:** Ensures data integrity using `class-validator`.
- **API Documentation:** Interactive API docs available through Swagger UI.
- **Error Handling:** Centralized error handling for robust and predictable API behavior.
- **Clean Architecture:** Separation of concerns for better maintainability and scalability.

## Technologies Used

- **Runtime:** Node.js
- **Language:** TypeScript
- **Framework:** Express.js
- **ORM:** TypeORM
- **Database:** SQLite
- **Validation:** class-validator, class-transformer
- **Documentation:** Swagger UI
- **Environment Management:** dotenv

## Getting Started

### Prerequisites

Ensure you have the following installed on your machine:

- **Node.js:** Version 14.x or higher
- **npm:** Comes with Node.js
- **Git:** For version control (optional)

### Installation

1. **Clone the Repository**

    ```bash
   git clone https://github.com/votre-utilisateur/rss-feed-manager.git
   cd rss-feed-manager
    ```

2. **Install Dependencies**

    Using pnpm:

    ```bash
    pnpm install
    ```

### Configuration

1. Environment Variables

    Create a .env file in the root directory of the project to configure environment-specific settings.

    ```env
    PORT=3000
    DATABASE_PATH=./rssfeeds.sqlite
    ```
    
   * PORT: The port on which the server will run. Default is 3000.
   * DATABASE_PATH: Path to the SQLite database file. Default is ./rssfeeds.sqlite.

2. TypeScript Configuration

    Ensure your tsconfig.json includes the following settings:

    ```json
    {
      "compilerOptions": {
        "target": "ES6",
        "allowSyntheticDefaultImports": true,
        "experimentalDecorators": true,
        "esModuleInterop": true,
        "outDir": "./dist",
        "forceConsistentCasingInFileNames": true,
        "strict": true,
        "skipLibCheck": true,
        "moduleResolution": "Node16",
        "module": "Node16",
        "rootDir": "./src",
        "resolveJsonModule": true,
        "emitDecoratorMetadata": true
      },
      "exclude": ["node_modules/"],
      "include": ["src/**/*.ts", "test/**/*.ts"]
    }
    ```

### Running the Application

1. Start the Development Server

    ```bash
    pnpm start
    ```
   This command uses ts-node to run the TypeScript application directly.

    OR

    ```bash
    pnpm dev
    ```

2. Build for Production

    To compile the TypeScript code into JavaScript:

    ```bash
    pnpm run build
    ```

    Then, to run the compiled code:

    ```bash
    pnpm run prod
    ```

## API Documentation
The API is documented using Swagger. Once the server is running, you can access the interactive API documentation at:

```
http://localhost:3000/api-docs
```

## Project Structure

```bash
rss-feed-manager/
├── src/
│   ├── controllers/
│   │   ├── AIAgentController.ts
│   │   ├── ArticleController.ts
│   │   ├── CollectionController.ts
│   │   └── RSSFeedController.ts
│   ├── dtos/
│   │   ├── ArticleDTO.ts
│   │   ├── CollectionDTO.ts
│   │   └── RSSFeedDTO.ts
│   ├── entities/
│   │   ├── AIAgent.ts
│   │   ├── AIAnalysis.ts
│   │   ├── Article.ts
│   │   ├── Collection.ts
│   │   └── RSSFeed.ts
│   ├── infrastructure/
│   │   ├── Config/
│   │   │   ├── config.ts
│   │   ├── database/
│   │   │   └── dataSource.ts
│   │   ├── entities/
│   │   │   ├── AIAgentEntity.ts
│   │   │   ├── AIAnalysisEntity.ts
│   │   │   ├── ArticleEntity.ts
│   │   │   ├── CollectionEntity.ts
│   │   │   └── RSSFeedEntity.ts
│   │   ├── integrations/
│   │   │   └── OllamaService.ts
│   │   ├── logger/
│   │   │   ├── logger.ts
│   │   └── repositories/
│   │       ├── AIAgentRepository.ts
│   │       ├── ArticleRepository.ts
│   │       ├── CollectionRepository.ts
│   │       └── RSSFeedRepository.ts
│   ├── middlewares/
│   │   ├── errorHandler.ts
│   │   └── routeNotFound.ts
│   ├── routes/
│   │   └── index.ts
│   ├── services/
│   │   └── CronService.ts
│   ├── swagger.json
│   ├── usecases/
│   │   ├── AIAgentUseCases.ts
│   │   ├── ArticleUseCases.ts
│   │   ├── CollectionUseCases.ts
│   │   └── RSSFeedUseCases.ts
│   ├── index.ts
│   └── swagger.json
├── .env
├── .env.dist
├── .gitignore
├── nodemon.json
├── package.json
├── pnpm-lock.yaml
├── Readme.md
└── tsconfig.json
```

### Description of Key Directories and Files

* controllers/: Contains controller classes handling HTTP requests and responses.
* dtos/: Data Transfer Objects defining the structure and validation of request bodies.
* entities/: Domain entities representing the core business objects.
* infrastructure/: Contains the database setup, TypeORM entities, and repositories for data access.
* database/: TypeORM DataSource configuration.
* entities/: TypeORM entity definitions.
* repositories/: Repository classes interfacing with TypeORM for CRUD operations.
* middlewares/: Express middleware functions, such as error handling.
* routes/: Express route definitions, organizing endpoints for feeds and collections.
* swagger.json: Swagger/OpenAPI specification for API documentation.
* usecases/: Application logic and business rules encapsulated in use case classes.
* index.ts: Entry point of the application, initializing the server and dependencies.

## License

This project is licensed under the MIT License.
