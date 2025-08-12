#!/bin/bash
cd project-management-dashboard/backend
./mvnw clean package -DskipTests
java -jar target/*.jar --server.port=$PORT