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
    - [Running Tests](#running-tests)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [License](#license)

## Description

**RSS Feed Manager** is a RESTful API built with Node.js and TypeScript, designed to manage RSS feeds and organize them into collections. Leveraging Clean Architecture principles, the application ensures a modular, maintainable, and scalable codebase. The API uses SQLite as the database, managed through TypeORM, and includes comprehensive API documentation via Swagger.

## Features

- **CRUD Operations**: Manage RSS Feeds, Collections, Articles, and AI Agents.
- **AI Integration**: Analyze articles using AI agents (e.g., Ollama, ChatGPT).
- **Flexible Analysis Configuration**: Customizable AI prompts and roles for agents.
- **Data Validation**: Ensures data integrity using class-validator.
- **Error Handling**: Centralized error handling for robust and predictable API behavior.
- **API Documentation**: Interactive API documentation via Swagger UI.
- **Clean Architecture**: Ensures separation of concerns for better maintainability and scalability.
- **Testing**: Includes unit and E2E tests to ensure robustness and reliability.

## Technologies Used

- **Runtime:** Node.js
- **Language:** TypeScript
- **Framework:** Express.js
- **ORM:** TypeORM
- **Database:** SQLite
- **Validation:** class-validator, class-transformer
- **Documentation:** Swagger UI
- **Environment Management:** dotenv
- **Testing Frameworks:** Jest, Supertest

## Getting Started

### Prerequisites

Ensure you have the following installed on your machine:

- **Node.js:** Version 20.x or higher
- **pnpm:** For dependency management, comes with Node.js
- **Git:** For version control (optional)
- **Ollama:** For using AI locally (optional)

### Installation

1. **Clone the Repository**

    ```bash
    git clone https://github.com/your-username/rss-feed-manager.git
    cd rss-feed-manager
    ```

2. **Install Dependencies**

   Using pnpm:

    ```bash
    pnpm install
    ```

### Configuration

1. **Environment Variables**

    Create a `.env` file in the root directory of the project to configure environment-specific settings. You should have separate `.env` files for each environment:

    * `.env`: For production.

    * `.env.test`: For testing.

    * `.env.development`: For development.

    Use the provided .`env.dist` file as a template for your environment files.

    Example `.env` file:

    ```env
    PORT=3000
    DATABASE_TYPE=sqlite
    #DATABASE_PATH=:memory: #For Testing
    DATABASE_PATH=./rssfeeds.sqlite
    OLLAMA_BASE_URL=http://localhost:11434
    ```

    - `PORT`: The port on which the server will run. Default is 3000.
    - `DATABASE_PATH`: Path to the SQLite database file. Default is `./rssfeeds.sqlite`.

2. **TypeScript Configuration**

   Ensure your `tsconfig.json` includes the following settings:

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
        "emitDecoratorMetadata": true,
        "types": ["node", "jest"],
        "isolatedModules": true
      },
      "exclude": ["node_modules/", "dist/"],
      "include": ["src/**/*.ts"]
    }

    ```

### Running the Application

1. **Start the Development Server**

    ```bash
    pnpm start
    ```
   This command uses ts-node to run the TypeScript application directly.

   OR

    ```bash
    pnpm dev
    ```

2. **Build for Production**

   To compile the TypeScript code into JavaScript:

    ```bash
    pnpm run build
    ```

   Then, to run the compiled code:

    ```bash
    pnpm run prod
    ```

### Running Tests

This project includes unit and E2E tests to ensure code reliability.

1. **Run All Tests**

    ```bash
    pnpm test
    ```

2. **Run Tests in Watch Mode**

    ```bash
    pnpm test:watch
    ```

3. **Generate Test Coverage Report**

    ```bash
    pnpm test:coverage
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
│   ├── application/
│   │   ├── commandes/
│   │   │   └── AssignToCollectionCommand.ts
│   │   ├── dtos/
│   │   │   ├── ActionDTO.ts
│   │   │   ├── AIAgentDTO.ts
│   │   │   ├── AIConfigurationDTO.ts
│   │   │   ├── ArticleCollectionDTO.ts
│   │   │   ├── ArticleDTO.ts
│   │   │   ├── AssignToCollectionActionDTO.ts
│   │   │   ├── RSSFeedCollectionDTO.ts
│   │   │   └── RSSFeedDTO.ts
│   │   ├── exception/
│   │   │   ├── NotANumberException.ts
│   │   │   ├── NotFoundException.ts
│   │   │   └── ValidationException.ts
│   │   ├── executors/
│   │   │   └── ActionExecutor.ts
│   │   └── usecases/
│   │       ├── ActionUseCases.ts
│   │       ├── AIAgentUseCases.ts
│   │       ├── AIAnalysisUseCases.ts
│   │       ├── ArticleCollectionUseCases.ts
│   │       ├── ArticleUseCases.ts
│   │       ├── ParseFeedUseCases.ts
│   │       ├── RSSFeedCollectionUseCases.ts
│   │       └── RSSFeedUseCases.ts
│   ├── domain/
│   │   └── entities/
│   │   │   ├── Action.ts
│   │   │   ├── AIAgent.ts
│   │   │   ├── AIAnalysis.ts
│   │   │   ├── AIConfiguration.ts
│   │   │   ├── Article.ts
│   │   │   ├── ArticleCollection.ts
│   │   │   ├── AssignToCollectionAction.ts
│   │   │   ├── RSSFeed.ts
│   │   │   └── RSSFeedCollection.ts
│   │   └── interfaces/
│   │       ├── IActionCommand.ts
│   │       ├── IAIAnalysisRepository.ts
│   │       ├── IAIService.ts
│   │       ├── IArticleRepository.ts
│   │       ├── IBaseCollection.ts
│   │       ├── IEntity.ts
│   │       ├── IRepository.ts
│   │       ├── IServiceFactory.ts
│   │       └── IUseCases.ts
│   ├── infrastructure/
│   │   ├── Config/
│   │   │   └── config.ts
│   │   ├── database/
│   │   │   ├── dataSource.ts
│   │   │   └── testDataSource.ts
│   │   ├── entities/
│   │   │   ├── ActionEntity.ts
│   │   │   ├── AIAgentEntity.ts
│   │   │   ├── AIAnalysisEntity.ts
│   │   │   ├── AIConfigurationEntity.ts
│   │   │   ├── ArticleCollectionEntity.ts
│   │   │   ├── ArticleEntity.ts
│   │   │   ├── AssignToCollectionActionEntity.ts
│   │   │   ├── RSSFeedCollectionEntity.ts
│   │   │   └── RSSFeedEntity.ts
│   │   ├── factories/
│   │   │   └── AIServiceFactory.ts
│   │   ├── integrations/
│   │   │   └── OllamaService.ts
│   │   ├── logger/
│   │   │   └── logger.ts
│   │   ├── mappers/
│   │   │   ├── ActionMapper.ts
│   │   │   ├── AIAgentMapper.ts
│   │   │   ├── AIAnalysisMapper.ts
│   │   │   ├── AIConfigurationMapper.ts
│   │   │   ├── ArticleCollectionMapper.ts
│   │   │   ├── ArticleMapper.ts
│   │   │   ├── RSSFeedCollectionMapper.ts
│   │   │   └── RSSFeedMapper.ts
│   │   └── repositories/
│   │   │   ├── ActionRepository.ts
│   │   │   ├── AIAgentRepository.ts
│   │   │   ├── AIAnalysisRepository.ts
│   │   │   ├── ArticleCollectionRepository.ts
│   │   │   ├── ArticleRepository.ts
│   │   │   ├── RSSFeedCollectionRepository.ts
│   │   │   └── RSSFeedRepository.ts
│   │   └── services/
│   │       └── CronService.ts
│   ├── presentation/
│   │   ├── controllers/
│   │   │   ├── ActionController.ts
│   │   │   ├── AIAgentController.ts
│   │   │   ├── AIAnalysisController.ts
│   │   │   ├── ArticleCollectionController.ts
│   │   │   ├── ArticleController.ts
│   │   │   ├── RSSFeedCollectionController.ts
│   │   │   └── RSSFeedController.ts
│   │   ├── factories/
│   │   │   └── ActionDTOFactory.ts
│   │   ├── middlewares/
│   │   │   ├── errorHandler.ts
│   │   │   └── routeNotFound.ts
│   │   └── routes/
│   │       ├── actions.ts
│   │       ├── agent.ts
│   │       ├── analysis.ts
│   │       ├── articleCollections.ts
│   │       ├── articles.ts
│   │       ├── rssFeedCollections.ts
│   │       ├── feeds.ts
│   │       └── index.ts
│   ├── utils/
│   │   ├── NumberUtils.ts
│   │   └── stringUtils.ts
│   ├── app.ts
│   ├── index.ts
│   └── swagger.json
├── tests/
│   ├── e2e/
│   │   ├── ActionController.e2e.spec.ts
│   │   ├── AIAgentController.e2e.spec.ts
│   │   ├── ArticleCollectionController.e2e.spec.ts
│   │   ├── ArticleController.e2e.spec.ts
│   │   ├── RSSFeedCollectionController.e2e.spec.ts
│   │   └── RSSFeedController.e2e.spec.ts
│   └── fixtures/
│       ├── ActionsFixtures.ts
│       ├── AIAgentFixtures.ts
│       ├── ArticleCollectionsFixtures.ts
│       ├── ArticlesFixtures.ts
│       ├── RSSFeedCollectionFixtures.ts
│       └── RSSFeedFixtures.ts
├── .env.dist
├── .gitignore
├── .prettierignore
├── .prettierrc
├── eslint.config.js
├── jest.config.js
├── jest.setup.js
├── LICENCE
├── nodemon.json
├── ormconfig.test.json
├── package.json
├── pnpm-lock.yaml
├── Readme.md
├── tsconfig.json
└── tsconfig.test.json
```

### Description of Key Directories and Files

- `application/`: Contains use cases, DTOs, and interfaces defining the business logic and contracts.
- `domain/`: Core entities representing the business models.
    - `entities/`: Domain entities representing the core business objects.
- `infrastructure/`:
    - `config/`: Configuration settings and utilities.
    - `database/`: TypeORM DataSource configuration.
    - `entities/`: TypeORM entity definitions for database interaction.
    - `integrations/`: External service integrations (e.g., OllamaService).
    - `mappers/`: Transformations between domain and database entities.
    - `repositories/`: Data access layer interfacing with TypeORM.
    - `services/`: Application-specific services (e.g., CronService).
- `presentation/`:
    - `controllers/`: Express controllers handling HTTP requests and responses.
    - `middlewares/`: Express middleware for error handling and request validation.
    - `routes/`: Route definitions organized by feature.
- `utils/`: General utility functions (e.g., string manipulation).
- `tests/`: Includes E2E tests.
- `index.ts`: Application entry point, initializing the server and dependencies.

## License

This project is licensed under the MIT License.
