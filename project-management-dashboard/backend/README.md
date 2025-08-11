# Project Management REST API

A minimal Spring Boot REST API for project management with PostgreSQL database.

## Features

- **Project Management**: Create, read, update, delete projects
- **Milestone Management**: Add milestones to projects with due dates
- **Database**: PostgreSQL with JPA/Hibernate
- **API Documentation**: Swagger/OpenAPI 3
- **Testing**: JUnit 5 with MockMvc

## API Endpoints

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/{id}` - Get project by ID with milestones
- `POST /api/projects` - Create new project
- `PUT /api/projects/{id}` - Update project
- `DELETE /api/projects/{id}` - Delete project

### Milestones
- `POST /api/projects/{projectId}/milestones` - Add milestone to project
- `PUT /api/milestones/{id}` - Update milestone
- `DELETE /api/milestones/{id}` - Delete milestone

## Setup

1. **Database Setup**
   ```sql
   CREATE DATABASE project_management;
   ```

2. **Configure Database**
   Update `src/main/resources/application.yml`:
   ```yaml
   spring:
     datasource:
       url: jdbc:postgresql://localhost:5432/project_management
       username: your_username
       password: your_password
   ```

3. **Run Application**
   ```bash
   mvn spring-boot:run
   ```

4. **Access Swagger UI**
   http://localhost:8080/swagger-ui.html

## Data Models

### Project
```json
{
  "name": "Project Name",
  "description": "Project Description",
  "startDate": "2024-01-01",
  "endDate": "2024-12-31",
  "status": "NEW"
}
```

### Milestone
```json
{
  "title": "Milestone Title",
  "description": "Milestone Description",
  "dueDate": "2024-06-01",
  "completed": false
}
```

## Testing
```bash
mvn test
```