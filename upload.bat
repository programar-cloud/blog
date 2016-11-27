rm public/ -r
hugo
aws s3 cp --cache-control max-age=3600 --acl public-read --storage-class REDUCED_REDUNDANCY --recursive public/ s3://www.programar.cloud