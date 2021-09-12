#!/bin/bash

echo Builing and starting server

./mvnw clean package -DskipTests

cd docker

cp ../target/server-0.0.1-SNAPSHOT.jar ./server/server.jar

docker-compose up --build
