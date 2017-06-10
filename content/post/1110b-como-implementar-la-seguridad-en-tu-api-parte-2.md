---
title: "Cómo implementar la seguridad de tu API (Segunda parte)"
date: 2017-06-10T12:38:20+01:00
description: "Todo lo que quisiste saber y siempre te dio pereza preguntar sobre seguridad en web services."
slug: como-implementar-la-seguridad-en-tu-api-parte-2
draft: false
tags:
- arquitectura
- programación
- seguridad
- jwt
temas:
- API
niveles:
- Intermedio

episode : "21"
audio : "https://ia601505.us.archive.org/34/items/como-implementar-la-seguridad-en-tu-api-parte-2/1110b-como-implementar-la-seguridad-en-tu-api-parte-2.mp3"
media_bytes : "17070930"
media_duration : "23:10"
images : ["/media/1110b-authorized-only.jpg"]
explicit : "no"

disqus_identifier: "como-implementar-la-seguridad-en-tu-api-parte-2"
disqus_title: "Cómo implementar la seguridad de tu API - Parte 2"
disqus_url: "https://programar.cloud/post/como-implementar-la-seguridad-en-tu-api-parte-2"
---

{{% img src="/media/1110b-authorized-only.jpg" alt="Beware of the cat" %}}

*TL;DR: Access key/Secret key es un mecanismo de autentificación muy popular pero JWT tiene ventajas al proporcionar más información sobre el usuario. Puedes centralizar la seguridad utilizando un API Gateway o implementarla en todos y cada uno de tus microservicios.*

{{% archive "https://ia601505.us.archive.org/34/items/como-implementar-la-seguridad-en-tu-api-parte-2/1110b-como-implementar-la-seguridad-en-tu-api-parte-2.mp3" %}}

Vale, esta es la segunda parte del {{% ilink "como-implementar-la-seguridad-en-tu-api-parte-1" "post en el que hablo de seguridad" %}} desde el punto de vista del desarrollador. Nos vamos a centrar en explicar tanto el acceso mediante Access Key como los detalles sobre JSON Web Token y hablaremos de las alternativas que tienes a la hora de implementar la autenticación incluyendo el uso de API gateways. ¡No lo pierdas!
<!--more-->

### ¿Qué es el API key y Secret key?

El primer mecanismo de autenticación del que te hablo, muy popular, es el de asignar un *API key* al consumidor (sea humano u otro programa): es un número único que utilizará para identificarse. Si te lo paras a pensar resulta ser completamente equivalente a la *cookie* que utilizas en las aplicaciones web clásicas aunque tienes que añadirla explícitamente en cada petición al servidor que hagas.

Por ejemplo, imagina que estás montando un microservicio que necesita utilizar a los [cognitive services](https://www.microsoft.com/cognitive-services/en-us/apis) de Azure para añadir inteligencia a sus funcionalidades. Para poder hacerlo el primer paso consiste en acceder a una web de Microsoft que te permite registrar tu aplicación (la que quiere acceder a los Cognitive services) y te proporciona dos *API keys*. El tener disponibles simultáneamente dos te permite rotarlas con mayor facilidad desplegando la segunda sin desactivar la primera durante un tiempo. A partir de ahí es solo cuestión de añadirla en la cabecera correspondiente a cada petición que hagas a los *cognitive services*.

{{% imgur jD3maMU "Gimme all the keys" %}}

En cambio si el cliente que está usando el API es un humano a través de una web esta forma de generar la clave no es práctica porque **lo que en el fondo quieres autenticar en este segundo caso no es la aplicación sino a cada usuario individual que la está usando en ese momento**. Lo normal en este caso es que la primera interacción del usuario se lleve a cabo contra un servicio específico al que le mandará el típico username/password y que se encargará de generar el *API key* dinámicamente exclusivo para esa sesión. Como te decía hace un rato en el fondo estamos replicando el mecanismo de las *cookies* pero de manera controlada.

Vale, no te emociones, que todavía podemos tener problemas: aunque utilices TLS para asegurar la confidencialidad de la comunicación en ocasiones querrás aumentar la seguridad para evitar ataques de tipo [man in the middle](https://es.wikipedia.org/wiki/Ataque_de_intermediario) en los que el súpervillano de turno coloca una trampa a lo largo del camino de tus datos haciéndose pasar por el destino de los mismos y de esta manera tiene acceso al contenido desencriptado de las comunicaciones... incluyendo el *API key*.

{{% imgur "0k2V9b3" "Trump in the middle" %}}

**Para evitar que pueda utilizarla para ejecutar sus propias operaciones puedes firmar la petición**. Típicamente se hace con una clave simétrica (que guarda también la parte servidora) a la que llamamos la **secret key**. El atacante que intercepta el tráfico puede leer tu *API key* y la firma que has generado (junto al resto del contenido) pero no puede crear sus propias invocaciones porque al no conocer el secreto no puede firmar por sí mismo.

Lo que sí podría hacer es repetir las que vaya interceptando volviendo a llamar al servidor con exactamente la misma petición. En este caso puedes usar varias tácticas para defenderte pero **la que mejores resultados te va a dar es implementar idempotencia**: que invocar la misma operación varias veces deje el sistema en el mismo estado que lo encontraría si solo se ejecutase una vez. Esta es una buena práctica en general porque así no te tienes que preocupar de los reintentos que hagas de forma legítima.

También puedes añadir un parámetro extra en la llamada al servidor que funcione como un ticket: una petición que use el mismo ticket que otra anterior debería ser descartada.

### ¿Qué es JSON Web Token (JWT)?

Ante todo mucha calma, porque te voy a explicar el mecanismo alternativo al *API key* más popular y el concepto en sí es muy sencillo. Pero curiosamente hay un montón de artículos ahí fuera que terminan confundiendo más que aclarando a quien los lee, así que si alguna vez has intentado averiguar de qué va eso de los *JSON Web Tokens* quizá hayas terminado dándole unos tragos a la botella. Esa excusa se termina hoy y aquí (pero puedo ofrecerte otras si todavía queda alcohol que finiquitar).

El JWT es solo una evolución del API Key. Básicamente en lugar de solo transmitir un número lo que haces a cada petición es mandar un pequeño documento con unos pocos campos obligatorios y otros que defines tú mismo según el escenario en el que te encuentras. El formato del documento es JSON porque alguno había que escoger. Y poner *web* en medio de algo siempre aporta caché. Espera, te enseño un ejemplo de documento:

``` json
{
  "alg": "HS256",
  "typ": "JWT"
}

{
  "sub": "1234567890",
  "name": "Alice wonderland",
  "roles": ["devel", "deployer"]
}
```

Vale, vale: técnicamente son dos documentos diferentes, la cabecera y el *payload* o contenido. El primero explicita que esto es JWT y que se firmará usando *HS256* ([HMAC SHA-256](https://es.wikipedia.org/wiki/HMAC#Ejemplos_de_HMAC_.28MD5.2C_SHA1.2C_SHA256.29)), luego te cuento más sobre esto pero recuerda que **si siempre usas los mismos valores en toda la aplicación tal vez no tengas que considerar esta parte obligatoria** y puedas ahorrar algunos bits en la llamada.

En nuestro caso hemos decidido incluir en el documento de *payload* un identificar de usuario (*sub* por *subject*) e información adicional que necesitamos para implementar nuestra aplicación: el nombre humano y sus permisos de autorización. Y esto es importante porque de esa manera desde el lado del servidor ya no tendrás que consultar ninguna fuente externa para obtener esos datos: implementas el mantenimiento del estado de la autenticación en el cliente que envía la cabecera. En este link puedes ver [la lista de campos estándar](https://en.wikipedia.org/wiki/JSON_Web_Token#Standard_fields).

También vas a necesitar un password (simétrico o asimétrico según lo que indiques en el campo ```alg``` de la cabecera) entre cliente y servidor. Lo llamaremos el *secret* y será utilizado para firmar:

```
signature = HMAC-SHA256(
    secret, encodeBase64(header) + '.' + encodeBase64(payload))
```

El token final lo calculas siguiendo esta fórmula:

```
encodeBase64(header) + '.' +
encodeBase64(payload) + '.' +
encodeBase64(signature)
```

Puedes usar [el depurador de jwt.io](https://jwt.io) para comprobar el resultado de firmar los documentos anteriores. Si ponemos que el *secret* es "bragasdeesparto" obtendrás un token final como el siguiente:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFsaWNlIHdvbmRlcmxhbmQiLCJyb2xlcyI6WyJkZXZlbCIsImRlcGxveWVyIl19.0ghVcvXMrSA6UQyqxhHPicpPwpvbHod77QCuMFRr4Qw
```

Ahora solo tienes que fijar como valor del *header* ```Authorization``` la palabra *bearer* seguida de dicho token. Esto es solo una forma de seguir el estándar HTTP que indica que tras el nombre de la cabecera puedes especificar el protocolo de autenticación utilizado... y JWT define el mismo como *bearer*.

```
Authorization: bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMj
M0NTY3ODkwIiwibmFtZSI6IkFsaWNlIHdvbmRlcmxhbmQiLCJyb2xlcyI6WyJkZXZlbCIsImR
lcGxveWVyIl19.0ghVcvXMrSA6UQyqxhHPicpPwpvbHod77QCuMFRr4Qw
```

**¡Fíjate bien! JWT no va encriptado, solo codificado en base64**. Así que todo lo que hemos comentado sobre súpervillanos capaces de aprovechar un *man in the middle* sigue siendo válido. Y desde luego aplicar JWT (como cualquier otra petición que requiera autorización) sin usar ```https``` es una forma segura de terminar siendo el *trending topic* del día.

Vale, ya eres experto o experta en JWT. Ahora vamos a ver cuál es el mejor lugar para comprobar las credenciales del usuario.

## ¿Dónde implemento la autenticación y autorización?

¡Buena pregunta! Básicamente tienes dos opciones: integrarla en cada uno de tus microservicios o centralizarla en API gateways.

> Si el súpervillano consigue comprometer un nodo de tu red y trata de invocar el API desde allí seguirá teniendo que autenticarse.

En el primer caso utilizarás el mecanismo que tu framework te proporcione, como *Spring Security* si estás con Spring Boot. La desventaja obvia es que tienes que hacer este trabajo (y hacerlo muy bien) en todos y cada uno de los componentes de tu sistema. A cambio toda la malla de tus servicios está protegida y no existe un único punto de fallo en la seguridad del sistema: si el súpervillano consigue comprometer un nodo de tu red y trata de invocar el API desde allí seguirá teniendo que autenticarse.

La segunda opción consiste en separar el acceso a tu API en un gateway específico y merece un apartado para ella sola.

## ¿Qué es un API gateway?

Un API gateway es un programa que actúa como filtro HTTP. Un proxy, vamos. Pero con funcionalidades que te ayudan a mejorar la utilización los consumidores hacen tus APIs. Típicamente puedes delegar en ellos la autenticación, caching, la cuotas de uso (por ejemplo en forma de número máximo de llamadas por segundo), la generación de métricas, etc. Y para usarlo solo tienes que colocarlo como puerta de entrada a tus microservicios.

> Al ser un componente independiente la gobernanza de la seguridad se vuelve mucho más sencilla.

Al ser un componente independiente la gobernanza de la seguridad se vuelve mucho más sencilla: no tienes que auditar cada microservicio individualmente ni conocer los lenguajes de programación en los que están desarrollados. También tienes un lugar centralizado en el que aplicar las reglas que creas oportunas y si tus programadores no implementaron la seguridad correctamente puedes añadirla de manera más o menos elegante.

Gracias al sistema de cache también mejoras el rendimiento de tu sistema y encima te permite *productivizar* tu API: un usuario gratuito (anónimo) podría por ejemplo invocarla una vez por minuto mientras que un usuario *premium* tendría una cuota más alta. El API gateway se encargaría de que se cumpliesen esas normas.

Por el lado negativo tienes que tener en cuenta que si el súpervillano consigue franquear esta puerta es posible que tenga pista libre a todo tu sistema, hasta la cocina. Aunque por supuesto nada te impide mezclar el enfoque te comentaba anteriormente (seguridad distribuida) con un API gateway: todo dependerá de la complejidad que quieras gestionar y de tus necesidades de seguridad.

{{% imgur bHtTRMK "AWS Api Gateway"%}}

Vale, quiero uno. ¿Cómo lo instalo? Dependiendo de tu infraestructura puedes desplegarlos de varias maneras. Por ejemplo, si te gusta frotarte contra el hardware físico y te apetece quemar dinero estoy seguro de que puedes [configurar un F5](https://f5.com/products/big-ip/secure-web-gateway-services-swgs) para que te funcione como tal. Pero también podrías hacer [algo más productivo](https://www.medicosdelmundo.org/) con ese dinero.

Si estás en cloud público tienes productos con estos roles. No entro (hoy) en detalles pero en AWS tienes un relativamente digno [API gateway](https://aws.amazon.com/es/api-gateway/) y en Azure encontrarás un muy completo [API management](https://azure.microsoft.com/es-es/services/api-management/) que Microsoft integró tras comprar la empresa *Apiphany* hace unos años. Son servicios gestionados, lo que siempre es BIEN. En la parte negativa está el precio (relativamente caro) y la latencia que añaden.

También tienes productos que se ofrecen como SaaS: [Apigee](https://apigee.com) (propiedad de Google), [3Scale](https://www.3scale.net/api-management/) (¡hola [Dani!](https://twitter.com/hdcesario)), etc. Toneladas de características y también se trata de servicios gestionados. Preguntadle a Dani cualquier duda sobre 3Scale, lo sabe todo.

Y por último **tienes unos cuantos proyectos open source estupendos que puedes instalar en tu sistema como creas más conveniente**. Mi preferido  es [Kong](https://getkong.org/about/): tiene algunas carencias pero es súper sencillo de usar y muy potente. Además su comunidad es la más amplia con diferencia y esto es un valor diferencial en cualquier producto basado en software libre. También tendrías que echarle un ojo a [API umbrella](https://apiumbrella.io/) y a [Tyk](https://tyk.io/) aunque este último tiene una estrategia comercial algo confusa.

{{% imgur 7pnDSzh "La mascota de Kong"%}}

En unos días (vale, vale, quizá no *en unos pocos días*) haré una pequeña demo en [el canal de youtube](https://youtube.com/c/programarcloud) para que entiendas mejor cómo se despliega un API gateway lo que puedes conseguir con él. Recuerda suscribirte para no perdértelo.

## Conclusiones

No te quejarás por falta de turrón  ¿eh? Después de las dos entradas en el blog tendrías que tener claro lo siguiente:

- Términos básicos de seguridad
- Diferencias entre aplicaciones web clásicas y API oriented
- Mecanismos de autenticación más populares (JWT & API keys)
- Métodos de despliegue (descentralizado y API Gateway)

Y nos quedaría por implementar algún ejemplo práctico. Si te parece bien voy a dejar la parte de desarrollo para cuando monte el curso estrictamente de programación pero como te decía a poco que pueda grabaré un pequeño vídeo sobre cómo instalar [Kong](https://getkong.org) y configurar la seguridad mediante *API keys*. Si quieres más detalles en [CAPSiDE](https://capside.com) tenemos un curso específico sobre este tema, coméntamelo si estás interesado. Y lo que te apetece es pasar una semana entera leyendo sobre estos temas no dejes de visitar la página del [OWASP sobre protección de APIs](https://www.owasp.org/index.php/Top_10_2017-A10-Underprotected_APIs).

En cualquier caso la seguridad es completamente crítica en cualquier sistema y recuerda lo que te he dicho al principio: añadirla a posteriori siempre sale muy caro.

Bueno, nos vemos dentro de nada. **Y acordaros de que cada vez que publicáis en Twitter o Linked-in un enlace al blog yo os quiero un poquito más**. Y que a la izquierda del post (o debajo, si estás con el móvil) tienes links para hacerlo cómodamente.

jv

pd: Como siempre la música es del bueno de  [Marcus](https://soundcloud.com/musicbymarcus) y oye, te la voy a poner enterita en el podcast para que la disfrutes de verdad. La imagen que ilustra el post la publica [Geralt en Pixebay](https://pixabay.com/es/users/geralt-9301/).

ppd: El diagrama de Trump in the Middle se basa en el [artículo sobre MitM](https://es.wikipedia.org/wiki/Ataque_de_intermediario) de la Wiki con un toque de [Nei Ruffino ](http://toolkitten.deviantart.com/art/PoliticsGQ-594831165). En serio, échale un ojo a sus ilustraciones.

pppd: ¡Oh! Y muchas gracias a [Félix Sanz](https://twitter.com/felixsanzm) por invitarme a usar [Photon](https://photon.sh/) :D Es un *syntax highlighter* súper fácil de integrar con Hugo que formatea el código incrustado para que quede estupendísimo. Échale un ojo que es gratis y funciona muy bien!
