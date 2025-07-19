<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# Evaluation Management System Backend

A comprehensive evaluation management system built with NestJS, TypeScript, and PostgreSQL that allows teachers/interviewers to create subjects, define competencies, and manage evaluation criteria.

## Features

- **Subject Management**: Create, read, update, and delete subjects (e.g., CloudComputing, DS, Networking)
- **Competency Management**: Add competencies under subjects with specific marks (0-10)
- **Input Validation**: Comprehensive validation using class-validator annotations
- **Error Handling**: Custom exceptions with global exception filter
- **Logging**: Multi-level logging (info, debug, error) throughout the application
- **Database Constraints**: PostgreSQL constraints ensure data integrity
- **Cascade Deletion**: Deleting a subject automatically removes its competencies

## API Endpoints

### Subjects

| Method | Endpoint        | Description                               | Body                            |
| ------ | --------------- | ----------------------------------------- | ------------------------------- |
| POST   | `/subjects`     | Create a new subject                      | `{ "name": "Data Structures" }` |
| GET    | `/subjects`     | Get all subjects with competencies        | -                               |
| GET    | `/subjects/:id` | Get subject by ID with competencies       | -                               |
| PATCH  | `/subjects/:id` | Update subject                            | `{ "name": "Updated Name" }`    |
| DELETE | `/subjects/:id` | Delete subject (cascades to competencies) | -                               |

### Competencies

| Method | Endpoint                            | Description                      | Body                                    |
| ------ | ----------------------------------- | -------------------------------- | --------------------------------------- |
| POST   | `/subjects/:subjectId/competencies` | Create competency under subject  | `{ "name": "Arrays", "marks": 7 }`      |
| GET    | `/subjects/:subjectId/competencies` | Get all competencies for subject | -                                       |
| GET    | `/competencies/:id`                 | Get competency by ID             | -                                       |
| PATCH  | `/competencies/:id`                 | Update competency                | `{ "name": "LinkedLists", "marks": 8 }` |
| DELETE | `/competencies/:id`                 | Delete competency                | -                                       |

## Example Usage

### 1. Create a Subject

```bash
curl -X POST http://localhost:3000/subjects \
  -H "Content-Type: application/json" \
  -d '{"name": "Data Structures"}'
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Data Structures",
    "created_at": "2024-01-15T10:00:00.000Z",
    "updated_at": "2024-01-15T10:00:00.000Z",
    "competencies": []
  },
  "message": "Subject created successfully"
}
```

### 2. Add Competencies to Subject

```bash
# Add Arrays competency
curl -X POST http://localhost:3000/subjects/1/competencies \
  -H "Content-Type: application/json" \
  -d '{"name": "Arrays", "marks": 7}'

# Add LinkedLists competency
curl -X POST http://localhost:3000/subjects/1/competencies \
  -H "Content-Type: application/json" \
  -d '{"name": "LinkedLists", "marks": 8}'
```

### 3. Get All Subjects with Competencies

```bash
curl http://localhost:3000/subjects
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Data Structures",
      "created_at": "2024-01-15T10:00:00.000Z",
      "updated_at": "2024-01-15T10:00:00.000Z",
      "competencies": [
        {
          "id": 1,
          "name": "Arrays",
          "marks": 7,
          "created_at": "2024-01-15T10:01:00.000Z",
          "updated_at": "2024-01-15T10:01:00.000Z"
        },
        {
          "id": 2,
          "name": "LinkedLists",
          "marks": 8,
          "created_at": "2024-01-15T10:02:00.000Z",
          "updated_at": "2024-01-15T10:02:00.000Z"
        }
      ]
    }
  ],
  "message": "Retrieved 1 subjects successfully"
}
```

## Validation Rules

### Subject Validation

- **Name**: Required, string, 2-100 characters
- **Uniqueness**: Subject names must be unique across the system

### Competency Validation

- **Name**: Required, string, 2-100 characters
- **Marks**: Required, integer, 0-10 range
- **Uniqueness**: Competency names must be unique within each subject

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Subject with name 'Data Structures' already exists",
  "timestamp": "2024-01-15T10:00:00.000Z",
  "path": "/subjects",
  "statusCode": 409
}
```

### Common Error Codes

- **400**: Bad Request (validation errors)
- **404**: Not Found (subject/competency doesn't exist)
- **409**: Conflict (duplicate names)
- **500**: Internal Server Error

## Database Schema

### Subject Table

```sql
CREATE TABLE subject (
  id SERIAL PRIMARY KEY,
  name VARCHAR UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Competency Table

```sql
CREATE TABLE competency (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  marks INTEGER CHECK (marks >= 0 AND marks <= 10),
  subjectId INTEGER REFERENCES subject(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(name, subjectId)
);
```

## Architecture

### Folder Structure

```
src/
├── common/
│   ├── exceptions/          # Custom exception classes
│   └── filters/            # Global exception filter
├── modules/
│   ├── subjects/
│   │   ├── controllers/    # HTTP request handlers
│   │   ├── dto/           # Data transfer objects with validation
│   │   ├── entities/      # TypeORM entities
│   │   └── services/      # Business logic
│   └── competencies/
│       ├── controllers/
│       ├── dto/
│       ├── entities/
│       └── services/
└── config/
    └── database.config.ts  # Database configuration
```

### Key Design Principles

- **Modular Architecture**: Separate modules for subjects and competencies
- **Single Responsibility**: Each service method handles one specific task
- **Proper Error Handling**: Custom exceptions with meaningful messages
- **Input Validation**: DTO validation using class-validator
- **Logging**: Comprehensive logging at service and controller levels
- **Database Integrity**: Foreign key constraints and check constraints

## Environment Setup

1. Copy `.env.example` to `.env` and configure:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_NAME=evaluation_system
```

2. Start the application:

```bash
npm run start:dev
```

The API will be available at `http://localhost:3000`

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
