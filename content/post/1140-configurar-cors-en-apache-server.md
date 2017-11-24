---
title: "Configurar CORS en Apache Server"
date: 2017-07-29T8:50:20+02:00
description: "Cómo configurar y probar CORS para invocar APIs con javascript."
slug: configurar-cors-en-apache-server
draft: false
tags:
- programación
- seguridad
- cors
- javascript
- apache
- httpd
- http
- tutorial
- video
temas:
- API
niveles:
- Intermedio

episode : "25"
video : ""
media_bytes : ""
media_duration : ""
images : [""]
explicit : "no"

disqus_identifier: configurar-cors-en-apache-server
disqus_title: Configurar CORS en Apache Server
disqus_url: "https://programar.cloud/post/configurar-cors-en-apache-server"
---      

{{% github "https://github.com/programar-cloud/cors-demo" %}}

Sí, sí: no es viernes. Pero este día extra de espera ha merecido la pena porque
os traigo un vídeo fresquísimo que en apenas veinte minutos te demuestra cómo
invocar un API REST con javascript incluso si se encuentra en un dominio diferente
al de la página que realiza la petición ¡activando CORS!

{{% youtube QqUZmt4OoCA %}}

<!--more-->

Recuerda que si no tienes muy claro qué es puedes visitar el capítulo anterior que
{{% ilink "entender-cors" "explica CORS con detalle" %}}.

Básicamente en la primera parte explico [el proyecto que puedes encontrar en github](https://github.com/programar-cloud/cors-demo) y justo a continuación
verás cómo configurar [Apache server](https://httpd.apache.org/docs/current/programs/httpd.html) para que
permita el acceso al mismo incluso si el dominio de la página no es el mismo
que el del API que invoca.

¡Y habrá gatitos!

## Links

- Proyecto en Github: https://github.com/programar-cloud/cors-demo
- UWamp: https://www.uwamp.com
