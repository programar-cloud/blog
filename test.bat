rm public/ -r
hugo
REM usa clean-css: npm install -g clean-css
call cleancss public\static\css\style-source.css -o public\static\css\style-source.css

aws s3 cp --cache-control max-age=3600 --acl public-read --recursive public/ s3://test.programar.cloud
