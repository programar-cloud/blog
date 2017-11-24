---
title: "Cómo implementar la seguridad de tu API (Primera parte)"
date: 2017-06-09T12:38:20+01:00
description: "Todo lo que quisiste saber y siempre te dio pereza preguntar sobre seguridad en web services."
slug: como-implementar-la-seguridad-en-tu-api-parte-1
draft: false
tags:
- arquitectura
- programación
- seguridad
temas:
- API
niveles:
- Intermedio

episode : "20"
audio : "https://ia801503.us.archive.org/0/items/como-implementar-la-seguridad-en-tu-api-parte-1/como-implementar-la-seguridad-en-tu-api.mp3"
media_bytes : "15425445"
media_duration : "22:19"
images : ["/media/1110-authorized-only.jpg"]
explicit : "no"

disqus_identifier: "como-implementar-la-seguridad-en-tu-api-parte-1"
disqus_title: "Cómo implementar la seguridad de tu API - Parte 1"
disqus_url: "https://programar.cloud/post/como-implementar-la-seguridad-en-tu-api-parte-1"
---

{{% img src="/media/1110-authorized-only.jpg" alt="Beware of the cat" %}}

*TL;DR: Basic Auth no es adecuado para autenticar usuarios en APIs. OAuth2 sirve para delegar, no para autenticar. Y todo tiene que ir por TLS. ¡Ah! Y nada de cookies. Ok, ahora me explico con más detalle.*

{{% archive "https://ia801503.us.archive.org/0/items/como-implementar-la-seguridad-en-tu-api-parte-1/como-implementar-la-seguridad-en-tu-api.mp3" %}}

Como decía la semana pasada, hoy vamos a hablar de seguridad. ¡La semana pasada! ¿Lo pillas? Ay... en serio, he echado de menos escribiros y espero que vosotros también os hayáis acordado de mi. Para compensar vuelvo con un capítulo súper práctico y detallado que espero que aclare todas las dudas que tienes sobre un pilar fundamental de tu arquitectura como es la seguridad. Vamos a ello.
<!--more-->

**Ojo cuidado: ¡este artículo tiene {{% ilink "como-implementar-la-seguridad-en-tu-api-parte-2" "segunda parte" %}} sobre JWT y API gateways!**


Primero, recuerda: yo también era developer antes de [meterme en la farándula](https://www.linkedin.com/in/javier-more/). Sé lo poco interesante que pueden parecer los aspectos relacionados con la seguridad y lo mucho que puede llegar intimidarte tener que pelear con ellos. Y puede que hasta pienses que este tema es algo de lo que principalmente se debería encargar a la gente de sistemas, que lo tuyo es hacer que pasen cosas. Pues lo siento, eso no va a funcionar.

> Y puede que hasta pienses que este tema es algo de lo que principalmente se debería encargar la gente de sistemas [...]. Pues lo siento, eso no va a funcionar.

Primer *disclaimer*: como ya te habrás dado cuenta casi no estoy hablando de infraestructura en el blog. Y este artículo no va a ser una excepción pero desde luego **tienes que tener muy presente que la configuración de tu red, reglas de enrutado, firewalls y credenciales de infraestructura son totalmente críticos si quieres mantener seguro tu sistema**. Pero esa parte la dejamos para más adelante, ahora me centro solo en los conceptos de desarrollo.

En cualquier caso ya te irás dando cuenta: en el mundo en el que estamos (con microservicios y entornos cloud) o implementas este tipo de *cross-concerns* a todos los niveles o te vas a dejar el presupuesto y el rendimiento en sucesivas capas de chapuzas. Porque muchachada, correr puede correr cualquier tonto. Pero para ganar una carrera de relevos necesitas un equipo coordinado y una estrategia que incluya a todos los miembros del equipo. Te cuento una batallita que me explicaron hace poco, que sé que te gustan.

Fue en una reunión, nos la explicó una persona que cada vez que habla es un buen momento para sacar una libreta y tomar notas. En este caso explicó la historia de una empresa en la que los servicios que utilizaban internamente no seguían las normas más elementales de cortesía: no se identificaban entre ellos, no hacían un número racional de las peticiones, etc. La solución obvia es mejorar esos programas, claro. Pero llevaban tantas líneas de código y la coordinación entre equipos era tan mala que optaron por desplegar filtros entre ellos en forma de *appliance*. Es decir, colocaban máquinas físicas para interconectarlos y en esas máquinas corría software que se encarga de garantizar el cumplimiento de las políticas de seguridad.

Funcionar, funcionaba. Barato no era. Pero para nada. ¿Por qué? Porque la seguridad era una chapuza añadida a posteriori, no una característica básica y transversal de la arquitectura. **Diseña tu seguridad en todas las capas del sistema y hazlo tan pronto como te pongas a crearlo o prepara la cartera**.

{{% imgur "dgk2WnQ" "El villano de Avengers 3"%}}

## Glosario de términos

Es decir, palabras que tienes que conocer. Recuerda que mientras más palabra conoces más cobras, así que estate pendiente. Si la parte en negrita te suena salta directamente al siguiente párrafo. Pero antes de seguir, segundo disclaimer:

{{% imgur "ZPB8x7T" "Acéptalo de una vez"%}}

**Clave simétrica**: la típica contraseña usada para encriptar, la de toda la vida. La que tienes que compartir con la personita que debe desencriptar. Y eso es malo porque la seguridad del sistema ya no depende solo de ti: si esa persona la compromete (típicamente escribiéndola en un post-it), estás vendido. Además, como me comenta el gran [Humbert](https://twitter.com/ackhum) gestionar claves simétricas cuando tienes que repartirlas a N personas es inviable.

**AES-256**: Un algoritmo de clave simétrica muy popular y ampliamente utilizado. Tu micro tiene instrucciones de bajo nivel que ayudan a implementarlo con lo resulta muy barato computacionalmente.

**Clave asimétrica**: son dos números (dos contraseñas, si lo quieres mirar así) relacionados matemáticamente. Tú te quedas un número (que llamaremos *privado*) y entregas el otro (el *público*). Bien, pues tienes una serie de algoritmos que trabajan sobre esos números y lo interesante es que no son reversibles. Por ejemplo, puedes encriptar usando un determinado algoritmo y la clave pública. Pero (y aquí está la gracia) no es posible desencriptar esos datos usando esa misma clave pública: solo lo puedes hacer con el número privado que está siendo custodiado por ti. A cara perro. Nadie más que tú tiene ese número privado, así que solo tú puedes descifrar el mensaje. A cambio computacionalmente todo es más costoso y vas a quemar más CPU que con clave simétrica.

{{% imgur "UURaYlN" "Alice y Bob pasándose mensajitos"%}}

**Claves de sesión**: típicamente son claves simétricas que se generan al conectarse un cliente por primera vez a un servidor y que dejan de ser válidas al cabo de un cierto (corto) periodo de tiempo. Son simétricas para que los algoritmos no gasten CPU pero se intercambian al empezar la conversación cifradas mediante claves asimétricas. La idea es que incluso si una de ellas queda comprometida los malos solo conseguirán leer la conversación de ese usuario concreto durante una pequeña ventana de tiempo. Más sobre esto más abajo.

**SSL/TLS**: es una forma de cifrar un canal de transmisión sin que los usuarios del mismo tengan que hacer nada especial. Es lo que por ejemplo utilizas cuando te conectas por ```https``` a un servidor: el servidor te envía un *certificado* con información sobre él mismo y con una clave pública. El navegador se inventa una clave simétrica de sesión y la encripta usando la clave pública que obtuvo del certificado que le había mandado el servidor. Una vez hecho la puede enviar al servidor sin miedo a que nadie excepto él pueda descifrarla y a partir de ese momento el resto de intercambios se lleva a cabo utilizando la clave simétrica.

**Firma de documento**: básicamente consiste en calcular un número a partir del contenido del documento más una clave (que puede ser simétrica o asimétrica) y compartir ese número con el destinatario de los datos. Solo los conocedores de la clave pueden comprobar la validez del número en el otro extremo por lo que de esta manera se garantiza tanto el origen como la integridad del mensaje porque cualquier cambio en el mismo daría lugar a otro número completamente diferente. Por cierto, Humbert me recuerda que [MD5 no se considera seguro](http://www.zdnet.com/article/md5-password-scrambler-no-longer-safe/) para firmar documentos ni para guardar passwords.

Aquí tienes una primera regla, por lo tanto:

{{% important %}}
TODO EL TRÁFICO QUE TRANSMITAS POR UNA RED QUE NO CONTROLES DEBE IR CIFRADO OBLIGATORIAMENTE. Y POSIBLEMENTE SI CONTRALAS LA RED TAMPOCO ESTÁ DE MÁS. ASÍ, EN MAYÚSCULAS Y NEÓN.
{{% /important %}}

**Autenticación**: es el proceso por el que un cliente o usuario demuestra que es quien dice que es. En una aplicación tradicional para humanos utilizas típicamente usuario/password para generar una identificador de sesión que se envía automáticamente en forma de *cookie* a cada petición. Más tarde verás que esta segunda parte es una MALA IDEA para un API.

**Autorización**: se trata de averiguar si quien ha realizado una petición tiene permiso o no para llevarla a cabo. Típicamente coges su identidad y revisas una lista de acciones asociadas a la misma. Pero luego verás que si somos astutos esa lista de acciones puedes mandarla junto a la identidad.

**Delegación**: aka *federación*. Es un mecanismo por el cual un usuario tiene permisos en dos sistemas distintos con dos cuentas diferentes y el sistema A pide al sistema B que le permita el acceso haciéndose pasar (impersonando) a ese usuario. El sistema B pregunta al usuario si está de acuerdo y si todo el mundo es feliz a partir de ahí el sistema A accede al B sin tener que molestarle más. Lo has hecho mil veces cada vez que te registras en una web con las credenciales de Google o de Facebook y es para lo que sirve ese infierno de especificación llamado OAuth2. En este artículo no voy a hablar sobre este tema. Hey, relax, ya llegará.

**Principal**: la entidad que estás autenticando. Por ejemplo, la usuario Alice.

**Realm**: los mecanismos de protección que tiene un determinado recurso. Normalmente se trata de una lista de usuarios que representan a los correspondientes *principals* junto a los permisos que tienen cada uno.

Vale, ya tienes un vocabulario digno de un consultor. Recuerda pedir un aumento. Ahora vamos a ver cómo funcionaba el proceso de autenticación en una aplicación web clásica.

## ¿Cómo funciona la autenticación en web?

Oye, que igual te estás preguntando ¿pero qué tiene de malo el viejo buen sistema de username/password? En realidad, por sí mismo, no tiene nada de malo. El problema viene cuando empiezas a pensar en el workflow clásico que se ha utilizado desde tiempos inmemoriales para acceder a una web y lo comparas con lo que necesitas para invocar un API.

Un rápido repaso en el que obviamente utilizamos SSL/TLS para <strike>codificar</strike> cifrar la comunicación:

{{% imgur "rHNS1yr" "Alice quiere un gato" %}}

1. Alice llega y abre la página que requiere autenticación.
2. El servidor no sabe nada sobre ella así que retorna un código HTTP 401 (no autorizada)
3. El navegador le muestra a Alice una cajita para que escriba su nombre de usuario
4. Alice rellena los datos con el username ("Alice") y el password ([pongamos que es "bragasdeesparto"](https://www.youtube.com/watch?v=DfQDXgI4vZg)).
5. El navegador concatena el nombre, un ":" y el password en una única cadena. Después aplica la función *base64* sobre ella (el resultado es *QWxpY2U6YnJhZ2FzZGVlc3BhcnRv*). La prefija con la palabra "Basic " y la envía al servidor utilizando la cabecera HTTP *Authorization*. Ojo, base64 es obviamente [un algoritmo reversible](https://es.wikipedia.org/wiki/Base64) así que más te vale utilizar TLS (https) para que nadie sepa lo que estáis intercambiando.
6. El servidor recibe la nueva petición, examina la cabecera y recupera la identidad del usuario y su password. Comprueba en el *realm* correspondiente que todo está en orden (**autenticando** al usuario) y revisa que tiene permiso para acceder al recurso que ha pedido (el proceso de **autorización**). Si es así lo transmite al navegador pero también genera un número único temporal (pongamos en nuestro juego que es "1234") denominado *identificador de sesión* y que se añade a la respuesta en forma de *cookie* (deliciosa galletita).
7. El navegador le muestra la respuesta a Alice.
8. Alice pulsa en un enlace que la redirige a otro recurso protegido. Junto a la petición se incluye **automáticamente** el ID de sesión del que hablábamos antes porque una cookie se envía siempre en todas las peticiones al servidor que la generó sin intervención manual.
9. El servidor recibe el valor de la cookie de sesión y recupera los datos de autenticación y autorización del usuario al que se le asignó, con lo que ya podemos repetir el ciclo las veces que queramos.

Vale, otro recordatorio importante: **[no es buena idea mezclar compresión gzip con cifrado](https://stackoverflow.com/questions/2767211/can-you-use-gzip-over-ssl-and-connection-keep-alive-headers)** porque puede suponer un vector de ataque que permita desencriptar el mensaje. Para para para: dale al enlace y lee el párrafo correspondiente para que se te grabe en la memoria.

## ¿Cómo funciona la autenticación en APIs?

Te puedes imaginar que **cuando estamos hablando de acceder a un API en lugar de cargar una pantalla este flujo tiene varios problemas importantes**.

Para empezar te das cuenta de que un nombre usuario está asociada de forma natural a un humano. *Alice*, *Bob*, o como se llame la personita. Y tu API va a ser consumida por humanos pero seguramente también por otros sistemas. No es natural asignar un username a un programa: es como llamar "Geranio" a tu gato si además tu gato pudiese clonarse las veces que haga falta y todos los clones te estuviesen pidiendo comida a la vez. Ok, ok, la metáfora se me está yendo de la mano otra vez.

> Leerás en muchos sitios que las cookies van en contra de la naturaleza *stateless* de las aplicaciones y esta noción es totalmente errónea.

Y después está el tema de las *cookies*. Leerás en muchos sitios que las cookies van en contra de la naturaleza *stateless* de las aplicaciones y esta noción es totalmente errónea. *Stateless* significa simplemente que si la aplicación se ejecuta en una flota de nodos podemos dirigir las peticiones del cliente a cualquiera de ellos sin que esto suponga un problema porque no se guarda información del proceso que se está llevando a cabo en la memoria de uno de esos nodos: los datos de perfil, del carrito de la compra, del formulario de inscripción o de lo que sea puedan cargarse fácilmente sin importar la máquina que procesa esa *request* concreta (desde una base de datos, desde datos de la propia petición, desde donde sea). Y eso es algo que no tiene nada que ver con las *cookies*: una galletita es solo un valor enviado por el navegador en forma de *header* HTTP automáticamente cuando realiza una petición al dominio que la guardó.

{{% important class="centered" %}}
¡¡AUTOMÁTICAMENTE!!
{{% /important %}}

Ok, ok. Lo siento: es que el efecto de neón es nuevo. Bueno, a lo que iba.

Ahí está el problema real de las galletas: no tienes control sobre el momento en el que se envían, algo que tiene todo el sentido cuando hablamos de pantallas porque sería muy engorroso incluirla en cada imagen, css o js que necesitamos cargar para armar el documento HTML. Pero las invocaciones del API se realizan expresamente cuando necesitas contactar con el servicio incluso si forman parte de una aplicación web así que vamos a tomar el otro camino obvio: explicitar la cabecera de identificación a cada llamada que hagamos.

{{% imgur PfXzpjM "Dame una cookie"%}}

En otras palabras, cada vez que necesitamos invocar un API incluiremos una cabecera que permita identificar al consumidor (usuario o programa) que la realiza. El nombre de la cabecera suele ser ***Authorization***, algo que no deja de provocar confusión porque en el fondo la estás usando para autenticar. Aunque esto no deja de ser una convención y en ocasiones verás como se utiliza ```X-Access-Key``` o cualquier otro nombre arbitrario.

¿Y qué es lo que vamos a enviar como valor? Aquí depende un poco de la implementación que hayas elegido. Te explico los mecanismos más comunes.

## ¿Qué viene a continuación?

El artículo ha quedado muy largo así que ¡te lo he dividido en dos partes! En la siguiente te cuento cómo usar {{% ilink "como-implementar-la-seguridad-en-tu-api-parte-2" "Access keys, JWT y API gateways" %}}. No te lo pierdas.

jv

pd: Como siempre la música es del bueno de  [Marcus](https://soundcloud.com/musicbymarcus) y oye, te la voy a poner enterita en el podcast para que la disfrutes de verdad. La imagen que ilustra el post la publica [Geralt en Pixebay](https://pixabay.com/es/users/geralt-9301/).

ppd: Aparentemente el origen etimológico del password de Paz Padilla es la frase "eres más basta que unas bragas de esparto". Si te la encuentras por la calle dile que utilizo esa contraseña en todas las demos en las que participo.

pppd: Y last but not least ¡mil gracias otra vez a [Humbert](https://twitter.com/ackhum) por sus aportaciones al post! Si no le conocéis estad pendientes de su tuiter porque es una de las personas que más sabe sobre seguridad informática que podéis encontrar.
