
## How to run the Minio Docker image
###run minio container
docker run -p 9000:9000 -p 9001:9001 --name minio -v D:\libraryForProject:/data -e "MINIO_ROOT_USER=root" -e "MINIO_ROOT_PASSWORD=password" quay.io/minio/minio server /data --console-address ":9001"
replace "D:\libraryForProject" with the file location you want to use

###run shared-library container
docker run -p 4000:4000 -e "MINIO_ENDPOINT=x.x.x.x" --name shared-library afekc/shared-library
replace "x.x.x.x" with the minio container ip 


###run docker compose(run both images #recommended)
docker stack deploy --compose-file docker-compose.yaml sharedlibrary