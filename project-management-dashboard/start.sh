#!/bin/bash
cd backend
./mvnw clean package -DskipTests
java -jar target/*.jar --server.port=$PORT