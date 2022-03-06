# NodeJS REST API for SQLite database Project

## Requirements
- NodeJS (12.12.0)

## Starter command

1. Setup: need NodeJS 8+ version and npm
2. Install dependencies with npm: `npm install`
3. Launch the server with `npm run serve`

## Use of Swagger UI !
Simply access to `http://localhost:4000/` to access SwaggerUI interface. It allows to run each route to manipulate the database.

## How to run the Minio Docker image
docker run -p 9000:9000 -p 9001:9001 --name minio -v D:\libraryForProject:/data -e "MINIO_ROOT_USER=root" -e "MINIO_ROOT_PASSWORD=password" quay.io/minio/minio server /data --console-address ":9001"
replace "D:\libraryForProject" with the file location you want to use

docker run -p 4000:4000 -e "MINIO_ENDPOINT=x.x.x.x" --name shared-library afekc/shared-library
replace "x.x.x.x" with the minio container ip 