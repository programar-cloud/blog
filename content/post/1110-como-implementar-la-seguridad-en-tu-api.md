---
title: "Cómo implementar la seguridad de tu API"
date: 2017-04-25T12:38:20+01:00
description: "Todo lo que quisiste saber y siempre te dio pereza preguntar sobre seguridad en web services."
slug: como-implementar-la-seguridad-en-tu-api
draft: true
tags:
- arquitectura
- programación
- seguridad
temas:
- API
niveles:
- Intermedio

episode : "17"
audio : ""
media_bytes : ""
media_duration : ""
images : [""]
explicit : "no"

disqus_identifier: "como-implementar-la-seguridad-en-tu-api"
disqus_title: "Cómo implementar la seguridad de tu API"
disqus_url: "https://programar.cloud/post/como-implementar-la-seguridad-en-tu-api"
---

{{% img src="/media/1110-authorized-only.jpg" alt="Beware of the cat" %}}

*TL;DR: Basic auth solo sirve para conseguir un token, que puede ser un API Key o un JWT. OAuth2 sirve para delegar, no para autenticar. Y todo tiene que ir por TLS. ¡Ah! Y nada de cookies. Ok, ahora me explico.*

{{% archive "" %}}

Como decía la semana pasada, hoy vamos a hablar de seguridad. ¡La semana pasada! ¿Lo pillas? Ay... en serio, he echado de menos escribiros y espero que vosotros también os hayáis acordado de mi. Para compensar vuelvo con un capítulo súper práctico que espero que aclare las dudas que tienes sobre un pilar fundamental de tu arquitectura como es la seguridad. Vamos a ello.
<!--more-->

> Y puede que hasta pienses que este tema es algo de lo que principalmente se debería encargar la gente de sistemas [...]. Pues lo siento, eso no va a funcionar.

Primero, recuerda: yo también era developer. Sé lo poco interesante que pueden parecer los aspectos de seguridad y lo complicado que puede llegar a parecerte. Y puede que hasta pienses que este tema es algo de lo que principalmente se debería encargar la gente de sistemas, que lo tuyo es hacer que pasen cosas. Pues lo siento, eso no va a funcionar.

Primer *disclaimer*: como ya te habrás dado cuenta casi no estoy hablando de infraestructura en el blog. Y este artículo no va a ser una excepción pero desde luego **tienes que tener muy presente que la configuración de tu red, reglas de enrutado, firewalls y credenciales de infraestructura son totalmente críticos si quieres mantener seguro tu sistema**. Pero esa parte la dejamos para más adelante, ahora me centro solo en los conceptos de desarrollo.

En cualquier caso ya te irás dando cuenta: en el mundo en el que estamos (con microservicios y entornos cloud) o implementas este tipo de cross-concerns a todos los niveles o te vas a dejar el presupuesto y el rendimiento en sucesivas capas de chapuzas. Porque muchachada, correr puede correr cualquier tonto. Pero para ganar una carrera de relevos necesitas un equipo coordinado y una estrategia que incluya a todos los miembros del equipo. Te cuento una batallita que me explicaron hace poco, que sé que te gustan.

Fue en una reunión, una persona que cada vez que habla es un buen momento para sacar una libreta y tomar notas. En este caso explicó la historia de una empresa en la que los servicios que utilizaban internamente no seguían las normas más elementales de cortesía: no se identificaban entre ellos, no hacían un número racional de las peticiones, etc. La solución obvia es mejorar esos programas, claro. Pero llevaban tantas líneas de código y la coordinación entre equipos era tan mala que optaron por deplegar filtros entre ellos en forma de *appliance*. Es decir, colocaban máquinas físicas para interconectarlos y en esas máquinas corría software que se encarga de garantizar el cumplimiento de las políticas de seguridad.

Funcionar, funcionaba. Barato no era. Pero para nada. ¿Por qué? Porque la seguridad era una chapuza añadida a posteriori, no una característica básica y transversal de la arquitectura. Diseña tu seguridad en todas las capas del sistema y hazlo tan pronto como te pongas a crearlo. O prepara la billetera.

{{% imgur "dgk2WnQ" "El villano de Avengers 3"%}}

## Glosario de términos

Es decir, palabras que tienes que conocer. Recuerda que mientras más palabra conoces más cobras, así que estate pendiente. Si la parte en negrita te suena salta directamente al siguiente párrafo. Pero antes de seguir, una aclaración:

{{% imgur "ZPB8x7T" "Acéptalo de una vez"%}}

**Clave simétrica**: la típica contraseña usada para encriptar, la de toda la vida. La que tienes que compartir con la personita que debe desencriptar. Y eso es malo porque la seguridad del sistema ya no depende solo de ti: si esa persona la compromete (típicamente escribiéndola en un post-it), estás vendido. Además, como me comenta el gran [Humbert](https://twitter.com/ackhum), gestionar claves simétricas cuando tienes que repartirlas a N personas es inviable.

**AES-256**: Un algoritmo de clave simétrica muy popular y ampliamente utilizado. Tu micro tiene instrucciones de bajo nivel que ayudan a implementarlo con lo resulta muy barato computacionalmente.

**Clave asimétrica**: son dos números (dos contraseñas, si lo quieres mirar así) relacionados matemáticamente. Tú te quedas un número (que llamaremos *privado*) y entregas el otro (el *público*). Bien, pues tienes una serie de algoritmos que trabajan sobre esos números y lo interesante es que no son reversibles. Por ejemplo, puedes encriptar usando un determinado algoritmo y la clave pública. Pero (y aquí está la gracia) no es posible desencriptar esos datos usando esa clave pública: solo lo puedes hacer con el número privado que está siendo custodiado por ti. A cara perro. Nadie más que tú tiene ese número privado, así que solo tú puedes descifrar el mensaje. A cambio computacionalmente todo es más costoso y vas a quemar más CPU que con clave simétrica.

{{% imgur "UURaYlN" "Alice y Bob pasándose mensajitos"%}}

**Claves de sesión**: típicamente son claves simétricas que se generan al conectarse un cliente por primera vez a un servidor y que dejan de ser válidas al cabo de un cierto (corto) periodo de tiempo. Son simétricas para que los algoritmos no gasten CPU pero se intercambian al empezar la conversación cifradas mediante claves asimétricas. La idea es que incluso si una de ellas queda comprometida los malos solo conseguirán leer la conversación de ese usuario concreto durante una pequeña ventana de tiempo. Más sobre esto más abajo.

**SSL/TLS**: es una forma de cifrar un canal de transmisión sin que los usuarios del mismo tengan que hacer nada especial. Es lo que por ejemplo utilizas cuando te conectas por ```https``` a un servidor: el servidor te envía un *certificado* con información sobre él mismo y con una clave pública. El navegador se inventa una clave simétrica de sesión y la encripta usando la clave pública que obtuvo del certificado que le había mandado el servidor. Una vez hecho la puede enviar al servidor sin miedo a que nadie excepto él pueda descifrarla y a partir de ese momento el resto de intercambios se lleva a cabo utilizando la clave simétrica.

**Firma de documento**: básicamente consiste en calcular un número a partir del contenido del documento más una clave (que puede ser simétrica o asimétrica) y compartir ese número con el destinatario de los datos. Solo los conocedores de la clave pueden comprobar la validez del número en el otro extremo por lo que de esta manera se garantiza tanto el origen como la integridad del mensaje porque cualquier cambio en el mismo daría lugar a otro número completamente diferente. Por cierto, Humbert me recuerda que [MD5 no se considera seguro](http://www.zdnet.com/article/md5-password-scrambler-no-longer-safe/) para firmar documentos ni guardar passwords.

Aquí tienes una primera regla, por lo tanto:

{{% important %}}
TODO EL TRÁFICO QUE TRANSMITAS POR UNA RED QUE NO CONTROLES DEBE IR CIFRADO OBLIGATORIAMENTE. Y POSIBLEMENTE SI CONTRALAS LA RED TAMPOCO ESTÁ DE MÁS. ASÍ, EN MAYÚSCULAS Y NEÓN.
{{% /important %}}

**autenticación**: es el proceso por el que un cliente o usuario demuestra que es quien dice que es. En una aplicación tradicional para humanos utilizas típicamente usuario/password para generar una identificador de sesión que se envía automáticamente en forma de *cookie* a cada petición. Más tarde verás que esta segunda parte es una MALA IDEA para un API.

**Autorización**: se trata de averiguar si quien ha realizado una petición tiene permiso o no para llevarla a cabo. Típicamente coges su identidad y revisas una lista de acciones asociadas a la misma. Pero luego verás que si somos astutos esa lista de acciones puedes mandarla junto a la identidad.

**Delegación**: aka *federación*. Es un mecanismo por el cual un usuario tiene permisos en dos sistemas distintos con dos icaciones diferentes y el sistema A pide al sistema B que le permita el acceso haciéndose pasar (impersonando) a ese usuario. El sistema B pregunta al usuario si está de acuerdo y si todo el mundo es feliz a partir de ahí el sistema A accede al B sin tener que molestarle más. Lo has hecho mil veces cada vez que te registras en una web con las credenciales de Google o de Facebook y es para lo que sirve ese infierno de especificación llamado OAuth2. En este artículo no voy a hablar sobre este tema. Hey, relax, ya llegará.

**Principal**: la entidad que estás autenticando. Por ejemplo, la usuario Alice.

**Realm**: los mecanismos de protección que tiene un determinado recurso. Normalmente se trata de una lista de usuarios que representan a los correspondientes *principals* junto a los permisos que tienen cada uno.

Vale, ya tienes un vocabulario digno de un consultor. Ahora vamos a ver cómo funcionaba el proceso de autenticación en una aplicación web clásica.

## ¿Cómo funciona la autenticación en webapps?

Oye, que igual te estás preguntando ¿pero qué tiene de malo el viejo buen sistema de username/password? En realidad, por sí mismo, no tiene nada de malo. El problema viene cuando empiezas a pensar en el workflow clásico que se ha utilizado desde tiempos inmemoriales para acceder a una web y lo comparas con lo que necesitas para invocar un API.

Un rápido repaso en el que obviamente utilizamos SSL/TLS para codificar la comunicación:

{{% imgur "rHNS1yr" "Alice quiere un gato" %}}

1. Alice llega y abre la página que requiere autenticación.
2. El servidor no sabe nada sobre ella así que retorna un código HTTP 401 (no autorizada)
3. El navegador le muestra a Alice una cajita para que escriba su nombre de usuario
4. Alice rellena los datos con el username ("Alice") y el password ([pongamos que es "bragasdeesparto"](https://www.youtube.com/watch?v=DfQDXgI4vZg)).
5. El navegador concatena el nombre, un ":" y el password en una única cadena. Después aplica la función *base64* sobre ella (el resultado es *QWxpY2U6YnJhZ2FzZGVlc3BhcnRv*). Le prefija con la palabra "Basic " y la envía al servidor utilizando la cabecera HTTP *Authorization*. Ojo, base64 es obviamente [un algoritmo reversible](https://es.wikipedia.org/wiki/Base64) así que más te vale utilizar TLS (https) para que nadie sepa lo que estáis intercambiando.
6. El servidor recibe la nueva petición, examina la cabecera y recupera la identidad del usuario y su password. Comprueba en el *realm* correspondiente que todo está en orden (**autenticando** al usuario) y revisa que tiene permiso para acceder al recurso que ha pedido (el proceso de **autorización**). Si es así lo transmite al navegador pero también genera un número único temporal (pongamos en nuestro juego que es "1234") denominado *identificador de sesión* y que se añade a la respuesta en forma de *cookie* (deliciosa galletita).
7. El navegador le muestra la respuesta a Alice.
8. Alice pulsa en un enlace que la redirige a otro recurso protegido. Junto a la petición se incluye **automáticamente** el ID de sesión del que hablábamos antes porque una cookie se envía siempre en todas las peticiones al servidor que la generó sin intervención manual.
9. El servidor recibe el valor de la cookie de sesión y recupera los datos de autenticación y autorización del usuario al que se le asignó, con lo que ya podemos repetir el ciclo las veces que queramos.

## ¿Cómo funciona la autenticación en APIs?

Te puedes imaginar que **cuando estamos hablando de acceder a un API en lugar de cargar una pantalla este flujo tiene varios problemas importantes**.

Para empezar te das cuenta de que un nombre usuario está asociada de forma natural a un humano. *Alice*, *Bob*, o como se llame la personita. Y tu API va a ser consumida por humanos pero seguramente también por otros sistemas. No es natural asignar un username a un programa: es como llamar "Geranio" a tu gato si además tu gato pudiese clonarse las veces que haga falta y todos los clones te estuviesen pidiendo comida a la vez. Ok, ok, la metáfora se me está yendo de la mano otra vez.

> Leerás en muchos sitios que las cookies van en contra de la naturaleza *stateless* de las aplicaciones y esta noción es totalmente errónea.

Y después está el tema de las *cookies*. Leerás en muchos sitios que las cookies van en contra de la naturaleza *stateless* de las aplicaciones y esta noción es totalmente errónea. *Stateless* significa simplemente que si la aplicación se ejecuta en una flota de nodos podemos dirigir las peticiones del cliente a cualquiera de ellos sin que esto suponga un problema porque no se guarda información del proceso que se está llevando a cabo en la memoria de uno de esos nodos: los datos de perfil, del carrito de la compra, del formulario de inscripción o de lo que sea puedan cargarse fácilmente sin importar la máquina que procesa esa *request* concreta (desde una base de datos, desde datos de la propia petición, desde donde sea). Y eso es algo que no tiene nada que ver con las *cookies*: una galletita es solo un valor enviado por el navegador en forma de *header* HTTP automáticamente cuando realiza una petición al dominio que la guardó.

{{% important class="centered" %}}
¡¡AUTOMÁTICAMENTE!!
{{% /important %}}

Vale, vale. Lo siento: es que el efecto de neón es nuevo. Bueno, a lo que iba.

Ahí está el problema real de las galletas: no tienes control sobre el momento en el que se envían, algo que tiene todo el sentido cuando hablamos de pantallas porque sería muy engorroso incluirla en cada imagen, css o js que necesitamos cargar para armar el documento HTML. Pero las invocaciones del API se realizan expresamente cuando necesitas contactar con el servicio incluso si forman parte de una aplicación web así que vamos a tomar el otro camino obvio: explicitar la cabecera de identificación a cada llamada que hagamos.

{{% imgur PfXzpjM "Dame una cookie"%}}

En otras palabras, cada vez que necesitamos invocar un API incluiremos una cabecera que permita identificar al consumidor (usuario o programa) que la realiza. El nombre de la cabecera suele ser ***Authorization***, algo que no deja de provocar confusión porque en el fondo la estás usuando para autenticar. Aunque esto no deja de ser una convención y en ocasiones verás como se utiliza ```X-Access-Key``` o cualquier otro nombre arbitrario.

¿Y qué es lo que vamos a enviar como valor? Aquí depende un poco de la implementación que hayas elegido. Te cuento los mecanismos más comunes.

### ¿Qué es el API key y Secret key?

El primero de ellos, muy popular, es el de asignar un *API Key* al consumidor: un número único que el usuario o la aplicación cliente utiliza para identificarse. Completamente equivalente a la *cookie* aunque tienes que añadirla explícitamente en las peticiones.

Esta llave puede intercambiarse en el momento en el que el humano responsable de la aplicación cliente que quiere acceder a tu API la registra en tu sistema. Es lo que por ejemplo haces al utilizar los espectaculares [cognitive services](https://www.microsoft.com/cognitive-services/en-us/apis) de Azure para añadir inteligencia artificial a tus programa.

{{% imgur jD3maMU "Gimme all the keys" %}}

En cambio si el cliente es un humano utilizando una webapp esta forma de generar la clave no es práctica porque **lo que en el fondo quieres autenticar no es la aplicación sino a cada usuario individual que la está usando en ese momento**. Lo normal en este caso es que la primera interacción del usuario se lleve a cabo contra un servicio específico de autenticación al que le mandará el típico username/password y que se encargará de generar el *API key* dinámicamente exclusivo para esa sesión. Como te decía hace un rato en el fondo estamos replicando el mecanismo de las *cookies* pero de manera controlada.

Aunque utilices TLS para asegurar la confidencialidad de la comunicación en ocasiones querrás aumentar la seguridad para evitar ataques de tipo [man in the middle](TODO!) en los que el súpervillano de turno coloca una trampa a lo largo del camino de tus datos haciéndose pasar por el destino de los mismos y de esta manera tiene acceso al contenido desencriptado de las comunicaciones... incluyendo el *API key*.

{{% imgur "0k2V9b3" "Trump in the middle" %}}

Para evitar que pueda utilizarla para ejecutar sus propias operaciones puedes firmar la petición. Típicamente se hace con una clave simétrica (que guarda también la parte servidora) a la que llamamos la **secret key**. El atacante que intercepta el tráfico puede leer tu *API key* y la firma que has generado (además de todo el contenido que no esté encriptado) pero no puede crear sus propias invocaciones porque al no conocer el secreto no puede firmar por sí mismo.

Lo que sí podría hacer es repetir las que vaya interceptando volviendo a llamar al servidor con exactamente la misma petición. Aquí hay varias tácticas pero la que mejores resultados te va a dar es implementar idempotencia: que invocar la misma operación varias veces deje el sistema en el mismo estado que lo encontraría si solo se ejecuta una vez. Esta es una buena práctica en general porque así no te tienes que preocupar de los reintentos que hagas de forma legítima.

Otra opción bastante popular es darle un tiempo de vida muy corto a la petición incluyendo un timestamp de expiración como parte de los datos que envías.

### ¿Qué es JSON Web Token (JWT)?

Ante todo mucha calma, porque te voy a explicar el mecanismo alternativo al *API key* más popular y el concepto en sí es muy sencillo. Pero curiosamente hay un montón de artículos ahí fuera que terminan confundiendo más que aclarando a quien los lee, así que si alguna vez has intentado averiguar de qué va eso de los *JSON Web Tokens* quizá hayas terminado dándole unos tragos a la botella. Esa excusa se termina hoy y aquí (pero puedo ofrecerte otras si todavía queda alcohol que finiquitar).

El JWT es solo una evolución del API Key. Básicamente en lugar de solo transmitir un número lo que haces a cada petición es mandar un pequeño documento con unos pocos campos obligatorios y otros arbitrarios según el escenario en el que te encuentras. El formato del documento es JSON porque alguno había que escoger. Y poner *web* en medio de algo siempre aporta caché. Espera, te enseño un ejemplo de documento:

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

Vale, vale: técnicamente son dos documentos diferentes, la cabecera y el *payload* o contenido. El primero explicita que esto es JWT y que se firmará usando *HS256* ([HMAC SHA-256](https://es.wikipedia.org/wiki/HMAC#Ejemplos_de_HMAC_.28MD5.2C_SHA1.2C_SHA256.29)), luego te cuento más sobre esto.

En nuestro caso hemos decidido incluir en el documento de *payload* un identificar de usuario (*sub* por *subject*) e información adicional que nos parece interesante: el nombre humano y sus permisos de autorización. Y esto es importante porque de esa manera desde el lado del servidor ya no tendrás que consultar ninguna fuente externa para obtener esos datos: implementas el mantenimiento del estado de la autenticación en el cliente que envía la cabecera. En este link puedes ver [la lista de campos estándar](https://en.wikipedia.org/wiki/JSON_Web_Token#Standard_fields).

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

¡Fíjate bien! JWT no va encriptado, solo codificado en base64. Así que todo lo que hemos comentado sobre súpervillanos capaces de aprovechar un *man in the middle* sigue siendo válido.

## ¿Dónde implemento la autenticación?

¡Buena pregunta! Básicamente tienes tres opciones: integrarla en cada uno de tus microservicios, usar una solucion SaaS o centralizarla en API gateways.

En el primer caso utilizarás el mecanismo que tu framework te proporcione, como *Spring Security* si estás con Spring Boot. La desventaja obvia es que tienes que hacer este trabajo (y hacerlo muy bien) en todos y cada uno de los componentes de tu sistema. A cambio toda la malla de tus servicios está protegida y no existe un único punto de fallo en la seguridad del sistema.

Respecto a la alternativa de delegar este proceso en un SaaS... bueno, la opción lógica era Stormpath: tenían un SDK súper bonito que lucía especialmente en escenarios de delegación, estaban muy enfocados en darte lo que necesitabas y nada más y la verdad es como producto era estupendo. Y hablo en pasado porque hace un par de semanas (en el momento en el que escribo este post) la empresa ha protagonizado una de esas "fusiones" que crean "sinergias". Ya me entiendes: los fundadores cogieron la pasta que les ofrecía [Okta](https://www.okta.com/) y cerraron el chiringuito. Un abrazo a todo sus clientes y doble abrazo a los que antes de Stormpath usaban [Parse](https://en.wikipedia.org/wiki/Parse_(company)).

La tercera opción merece un apartado para ella sola.

## ¿Qué es un API gateway?

Un API gateway es un programa que actúa como filtro HTTP. Un proxy, vamos. Pero con funcionalidades que te ayudan a mejorar la utilización los consumidores hacen tus APIs. Típicamente puedes delegar en ellos la autenticación, caching, la cuotas de uso (por ejemplo en forma de número máximo de llamadas por segundo), la generación de métricas, etc. Y para usarlo solo tienes que colocarlo como puerta de entrada a tus microservicios.

> Al ser un componente independiente la gobernanza de la seguridad se vuelve mucho más sencilla.

Al ser un componente independiente la gobernanza de la seguridad se vuelve mucho más sencilla: no tienes que auditar cada microservicio individualmente ni conocer los lenguajes de programación en los que están desarrollados. También tienes un lugar centralizado en el que aplicar las reglas que creas oportunas y si tus programadores no implementaron la seguridad correctamente puedes añadirla de manera más o menos elegante.

**También mejoras el rendimiento de tu sistema y puedes *productivizar* tu API**: un usuario gratuíto (anónimo) podría por ejemplo invocarla una vez por minuto mientras que un usuario *premium* tendría una cuota más alta.

Por el lado negativo tienes que tener en cuenta que si el súpervillano consigue franquear esta puerta es posible que tenga pista libre a todo tu sistema, hasta la cocina. Aunque por supuesto nada te impide mezclar el enfoque te comentaba anteriormente (seguridad distribuida) con un API gateway: todo dependerá de la complejidad que quieras gestionar y de tus necesidades de seguridad.

{{% imgur bHtTRMK "AWS Api Gateway"%}}

Depende de tu infraestructura puedes desplegarlos de varias maneras. Por ejemplo, si te gusta frotarte contra el hardware físico y te apetece quemar dinero estoy seguro de que puedes [configurar un F5](https://f5.com/resources/white-papers/authentication-101) para que te funcione como tal. Pero también podrías hacer [algo más productivo](https://www.medicosdelmundo.org/) con ese dinero.

Si estás en cloud público tienes productos con estos roles. No entro (hoy) en detalles pero en AWS tienes un bastante digno [API gateway](https://aws.amazon.com/es/api-gateway/) y en Azure encontrarás un muy completo [API managment](https://azure.microsoft.com/es-es/services/api-management/) que integró tras comprar la empresa *Apiphany* hace unos años. Son servicios gestionados, lo que siempre es BIEN. En la parte negativa está el precio (relativamente caro) y la latencia que añaden, sobre todo en el caso de AWS.

También tienes servicios que se ofrecen como SaaS: [Apigee](https://apigee.com) (propiedad de Google), [3Scale](https://www.3scale.net/api-management/) (¡hola [Dani!](https://twitter.com/hdcesario)), etc. Toneladas de características y también se trata de servicios gestionados. Preguntadle a Dani cualquier duda sobre 3Scale, lo sabe todo.

Y por último tienes unos cuantos productos open source estupendos que puedes instalar en tu sistema como creas más conveniente. Mi preferido (porque es el que conozco más) es [Kong](https://getkong.org/about/). Tiene algunas carencias pero es súper sencillo de usar y muy potente. También tendrías que echarle un ojo a [API umbrella](https://apiumbrella.io/) y a [Tyk](https://tyk.io/) aunque este último tiene una estrategia comercial algo confusa.

{{% imgur 7pnDSzh "La mascota de Kong"%}}

En unos días (vale, vale, quizá no *en unos pocos días*) haré una pequeña demo en [el canal de youtube])(https://youtube.com/c/programarcloud) para que entiendas mejor cómo se despliega un API gateway lo que puedes conseguir con él.

## Conclusiones

Como me descuide en las postdatas vuelvo a llegar a las 4000 palabras, así que voy cortando ya. A estas alturas deberías tener claro lo siguiente:

- Términos básicos de seguridad
- Diferencias entre aplicaciones web clásicas y API oriented
- Mecanismos de autenticación más populares (JWT & API keys)
- Métodos de despliegue (descentralizado y API Gateway)

Y nos quedaría por implementar algún ejemplo práctico. Si te parece bien voy a dejar la parte de desarrollo para cuando monte el curso estrictamente de programación pero como te decía a poco que pueda grabaré un pequeño vídeo sobre cómo instalar [Kong](https://getkong.org) y configurar la seguridad mediante *API keys*. Si quieres más detalles en [CAPSiDE](https://capside.com) tenemos un curso específico sobre este tema, coméntamelo si estás interesado.

¿Todavía con ganas de leer más sobre este tema? Échale un vistazo a la página del [OWASP sobre protección de APIs](https://www.owasp.org/index.php/Top_10_2017-A10-Underprotected_APIs).

En cualquier caso la seguridad es completamente crítica en cualquier sistema y recuerda lo que te he dicho al principio: añadirla a posteriori siempre sale muy caro.

Bueno, nos vemos dentro de nada. Y acordaros de que cada vez que publicáis en Twitter o Linked-in un link al blog yo os quiero un poquito más. Y que a la izquierda del post (o debajo, si estás con el móvil) tienes links para hacerlo cómodamente.

jv

ps: Como siempre la música es del bueno de  [Marcus](https://soundcloud.com/musicbymarcus) y oye, te la voy a poner enterita en el podcast. La imagen la publica [Geralt en Pixebay](https://pixabay.com/es/users/geralt-9301/).

pps: Aparentemente el origen etimológico del password de Paz Padilla es la frase "eres más basta que unas bragas de esparto".

ppps: Imprescindible site en el que se ofrecen todo tipo de [detalles sobre las cookies](http://www.recetacookies.com/).

pppps: El diagrama de Trump in the Middle se basa en el [artículo sobre MitM](https://es.wikipedia.org/wiki/Ataque_de_intermediario) de la Wiki con un toque de [Nei Ruffino ](http://toolkitten.deviantart.com/art/PoliticsGQ-594831165). En serio, échale un ojo a sus ilustraciones.

ppppps: Y last but not least ¡mil gracias otra vez a [Humbert](https://twitter.com/ackhum) y [Loïc](https://twitter.com/monsenyor) por sus aportaciones al post! Son más majos que las pesetas y saben mucho más sobre seguridad que yo :)
