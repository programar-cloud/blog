rm public/ -r
hugo
REM usa clean-css: npm install -g clean-css
call cleancss public\static\css\style-source.css -o public\static\css\style-source.css

aws s3 cp --cache-control max-age=3600 --acl public-read  --recursive public/ s3://www.programar.cloud

aws s3 cp s3://www.programar.cloud/ s3://www.programar.cloud/ --exclude "*" --include "*.svg" --include "*.jpg" --include "*.png" --recursive --metadata-directive REPLACE --expires 2034-01-01T00:00:00Z --acl public-read --cache-control max-age=2592000,public

rem aws cloudfront create-invalidation --distribution-id E3S9860XR0PA7U --paths /post/devops-en-serio/index.html
