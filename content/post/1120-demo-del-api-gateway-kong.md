---
title: "Demo del Api Gateway Kong"
date: 2017-06-16T8:50:20+02:00
description: "Cómo configurar y probar el Api Gateway Kong."
slug: demo-del-api-gateway-kong
draft: false
tags:
- arquitectura
- programación
- seguridad
- kong
- apigateway
temas:
- API
niveles:
- Intermedio

episode : "22"
video : ""
media_bytes : ""
media_duration : ""
images : [""]
explicit : "no"

disqus_identifier: demo-del-api-gateway-kong
disqus_title: Demo del Api Gateway Kong
disqus_url: "//programar.cloud/post/demo-del-api-gateway-kong"
---      

¡Volvemos a tener vídeo! Esta semana vamos a poner en práctica lo que hemos explicado sobre seguridad en {{% ilink "como-implementar-la-seguridad-en-tu-api-parte-1" "el post con el glosario" %}} y en el que hablaba {{% ilink "como-implementar-la-seguridad-en-tu-api-parte-2" "sobre implementaciones" %}}.

Configuraremos el API gateway [Kong](https://getkong.org/) para que nos autentifique mediante API Key. En el post puedes ver todos los comandos que he usado así que no hay excusa para no ponerte manos a la obra y probarlo :)

{{% youtube ayNLGfSHGFk %}}

<!--more-->

<!--host=$(ifconfig | awk '/inet addr/ {gsub("addr:", "", $2); print $2}' | head -n1)-->

## Instalar Kong

```
docker run -d --name kong-database \
              -p 5432:5432 \
              -e POSTGRES_USER=kong \
              -e POSTGRES_DB=kong \
              postgres:9.4

docker run -d --name kong \
              --link kong-database:kong-database \
              -e KONG_DATABASE=postgres \
              -e KONG_PG_HOST=kong-database \
              -p 8000:8000 \
              -p 8443:8443 \
              -p 8001:8001 \
              -p 7946:7946 \
              -p 7946:7946/udp \
              kong:0.10.1
```

## Configurar [Httpie](https://httpie.org/)

```
host=<tu-hostname-externo>
alias http='docker run -it --rm mcampbell/httpie'
http httpbin.org/headers
http $host:8000
```

## Registrar un API

```
http POST $host:8001/apis name=demo hosts=$host upstream_url=http://httpbin.org
http $host:8000/headers Host:$host
```

## Activar plugin Key-Auth

```
http POST $host:8001/apis/demo/plugins name=key-auth
http $host:8000/headers Host:$host
```

## Crear usuario Alice

```
http POST $host:8001/consumers username=alice custom_id=alice@wonderland.com
http POST $host:8001/consumers/alice/key-auth key=1111
http POST $host:8001/consumers/alice/key-auth key=2222
```

## Probar autenticación

```
http $host:8000/headers Host:$host apikey:1111
http DELETE $host:8001/consumers/alice/key-auth/1111
```
