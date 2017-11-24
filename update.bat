rm public -fr
hugo
aws s3 cp --cache-control max-age=100000 --acl public-read --recursive public/post/ s3://www.programar.cloud/post
