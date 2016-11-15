---
title: Microservicios en el mundo real
date: 2016-11-18T8:50:20+02:00
description: "Algunos ejemplos de cómo las empresas están aplicando hoy en día arquitecturas orientadas a microservicios"
slug: microservicios-en-el-mundo-real
draft: false
tags:
- arquitectura
- casos
- microservicios
temas:
- Conceptos
niveles:
- Iniciaciación

disqus_identifier: microservicios-en-el-mundo-real
disqus_title: Microservicios en el mundo real
disqus_url: //programar.cloud/posts/microservicios-en-el-mundo-real
---

{{% img src="/media/amazon-homepage.jpg" alt="Amazon front page" class="framed" %}}

*TL:DR; Las aplicaciones cloud nativas basadas en microservicios no son una moda o un ejercicio teórico. Los sistemas de Amazon, Netflix, Spotify, Soundcloud, etc se basan en ellos.*

Quizá no te suene la pantalla que ves arriba. Porque hace unos años te secuestró una nave extraterrestre y acabas de regresar [con otras 4399 personas](https://www.imdb.com/title/tt0389564/). En caso contrario seguro que has visitado Amazon en alguna ocasión: es el *retailer* de referencia en el mundo y ya hemos hablado de ellos antes. 

Bueno, pues algún detalle extra: ¿cuántos microservicios crees que se coordinan para generar esa pantalla? ¿20? ¿50? Te lo cuento en el vídeo de hoy (calma, es cortito) pero ya te adelanto que alguno más.<!--more-->

> Han conseguido mantener un modelo ágil a pesar de su gigantesco tamaño.

Y ahora atiende: **Amazon hace un deploy en 2016 cada 0.6 segundos**. Más de 100.000 al día. Mientras lees este párrafo de pocas líneas han lanzado tres o cuatro mejoras. Eso significa que si hay que cambiar el color del degradado de un botón ligeramente lo hacen, lo prueba y lo mandan producción sin mayor ceremonia y sin esperar a una determinada hora para hacer una nueva release. Lo más espectacular es que no se trata de una compañía pequeña: han conseguido mantener un modelo ágil a pesar de su gigantesco tamaño.

Vale, vale, es verdad, soy un pesado con Amazon. Vamos a hablar de Spotify. Te doy algunas cifras: tienen más de 75 millones de usuarios activos, están distribuídos en 58 países, agregan unas 20.000 canciones a su catálogo **cada día** y almacenan más de dosmil millones de listas de reproducción (!). Pero además imagínate la complejidad que tiene un negocio en el que un usuario de USA y otro de España escuchan la misma canción pero los royalties generados por ello tienen que ir a parar a diferentes compañías por cuestiones de derechos

{{% imgur DZe9rAt "Spotify" %}}

Desde hace tiempo la arquitectura de Spotify se basa en microservicios que en ocasiones comparten storage. Uno de los patrones que implementan es el de *vistas*: los clientes acceden a la platforma a través de un microservicio más o menos equivalente a una pantalla de la aplicación que es el encargado de invocar a todos los demás componentes y agregar los resultados para retornarlos como un único documento a quien realizó la petición. De esta manera se reduce el tráfico externo (más caro), se simplifica el cliente y sobre todo se mejora la latencia. Son un proxy en el servidor de las pantallas del cliente.

> 600 devels divididos en 90 equipos autónomos y multidisplinares.

En 2016 Spotify cuenta con 600 devels divididos en 90 equipos autónomos y multidisplinares, cada uno de ellos cuidando su propio grupo de microservicios. En total tienen desplegados más de 800. Utilizan principalmente Java para facilitar la movilidad del personal entre equipos aunque últimamente han decidido que adoptarán también otros lenguajes para tareas concretas.

Como otras empresas que veremos han liberado parte de su tecnología como Open Source. Más adelante le dedicaremos algunos post a [Project Apollo](https://github.com/spotify/apollo), la pieza más potente e interesante que puedes encontrar en su github.

{{% imgur kHpll4K "Netflix" %}}

¿Y Netflix? ¿Es que no vamos a hablar de Netflix? Claro que sí, maldita sea. Si hay una empresa que ha hecho pedagogía de esta forma de construír software es Netflix: su github incluye decenas de herramientas que facilitan el despliegue de microservicios en el cloud. Bueno, en un cloud: AWS. 

Si quieres cifras puedo contarte que en 2016 tienen 50 millones de suscriptores (no usuarios, suscriptores: gente que paga cada mes) en todo el mundo y reciben más de dos mil millones de peticiones a su API desde el exterior cada día que a su vez generan un gran número de peticiones internas. También es espectacular el que un viernes por la noche en USA el 30% del tráfico de internet en ese país procede de sus servidores (oh, wow).

> En 2008 todo Netflix se desplegaba como un único fichero .war en un servidor de aplicaciones java.

Además esta gente ha vivido su propia travesía del desierto: en 2008 todo Netflix se desplegaba como un único fichero .war en un servidor de aplicaciones java. Intenta interiorizar esto. TODO NETFLIX. ¿Tú crees que tus puestas en producción son problemáticas? Ellos sí sabían lo que quería decir *problemático*. 

En dos años rompieron ese gigantesco monolito y lo transformaron en decenas (y más tarde, centenares) de microservicios que corren en AWS.

Un punto especialmente interesante de esta empresa es que fueron pioneros en crear herramientas de automatización muy sofisticadas. De hecho, cuando se dieron cuenta de que la consola oficial de AWS no encajaba con sus necesidades (está más orientada a monitorización que a despliegue) crearon un sustituto llamado Asgard mucho más adaptado a su workflow. Y la publicaron como Open Source: en el vídeo que acompaña a este post te cuento más detalles sobre este tema.

{{% imgur 4hFYppe "Soundcloud" %}}

Otro ejemplo: en Soundcloud [pasaron de una monolítica escrita en Ruby on Rails a una sopa de microservicios](//philcalcado.com/2015/09/08/how_we_ended_up_with_microservices.html) desarrollados con Scala, Clojure y JRuby. En lugar de romper la aplicación original en porciones decidieron congelar sus funcionalidades y añadir las nuevas en forma de proyectos independientes. Les ayudó mucho el hecho de que ya estaban basando la comunicación con el exterior en un API bien definida con lo que desde el punto de vista de los clientes no supuso ninguna diferencia y solo más tarde empezaron a desgajar la aplicación original.

Un detalle interesante de su arquitectura es que la invocación de algunos microservicios sigue un patrón asíncrono basado en eventos. Quiero decir... normalmente las interacciones con el usuario se consideran principalmente síncronas (Alice hace una petición al servidor e inmediatamente recibe una respuestas) excepto si se trata de una tarea pesada (generar un report o funcionalidades de este estilo). No en el caso de Soundcloud. 

Por ejemplo, el añadir un nuevo comentario en una canción hace que se guarde un mensaje con dicho evento en una cola RabbitMQ y que sea la cola la que activamente afecte a los servicios de comentarios y de notificaciones. Actúa como mecanismo de desacoplamiento: si mañana se necesita que el mismo evento tenga un tercer efecto solo hay que añadir un consumidor más a la misma. A continuación un pequeño dibujo que ilustraría esta arquitectura si fuese capaz de dibujar mínimamente bien:

{{% imgur 5zXFz52 "Desacoplamiento por colas" %}}

¿Y en empresas más cercanas? ¿Se están utilizando estos patrones? En los clientes que tengo más a mano hay de todo, aunque está claro que queda mucho trabajo por hacer. Pero cada vez es más común encontrarte con gente como Schibsted, que están aplicando tanto metodología ágil con técnicas de devops y arquitecturas orientadas a microservicio con muchísimo éxito. Quizá no los reconozcas por este nombre pero son los responsables de Infojobs, Fotocasa, Coches.net, etc. Solo tienes que echar un ojo a sus [ofertas de trabajo](https://www.google.es/search?q=schibsted+microservicios) para comprobar que están muy orientados hacia agilidad. Y ya te digo: son buenos implementando software. El [blog técnico](http://bytes.schibsted.com/category/software-engineering/) que publican es súper interesante, no dejes des sucribirte a él.

Otras empresas están en mitad del proceso de evolucionar desde un horror monolítico sacado del peor círculo infernal de Dante a una arquitectura cloud (que sin ser perfecta) al menos les está quitando un buen número de problemas. Y desde luego es muy probable que terminen antes la transición del software que la cultural: nunca te olvides que al final **las personas importan mucho más que las herramientas**.

{{% imgur JfvMvdN "Dilbert y las buenas prácticas" %}}

Pero en la mayoría de los casos lo que hay es, sobre todo, una conciencia clara de que hay que mejorar lo que tienen. Que hay que conseguir entregar mejor software en menos tiempo. La parte buena es que nunca antes las herramientas para hacerlo han sido tan asequibles... aunque probablemente ya te estarás dando cuenta de que es mucho más fácil instalar un Jenkins que conseguir que los que están en las trincheras cambien la forma en la que han estado haciendo aplicaciones durante años.

¡Ah! En los vídeos de hoy te resuelvo el enigma del número de servicios que componen el frontal de Amazon y echamos un vistazo rápido a algunas cuentas de github que tienes que conocer sí o sí. Ya me contarás si te gustan. No, en serio, coméntamelo, que interaccionar con vosotros y vosotras siempre me hace ilusión.



jv


pd: La imagen del post es de Amazon. La música que sirve de cortinilla del vídeo es de [Marcus](https://soundcloud.com/musicbymarcus/promo-music-inspiational) y me hace sonreír cada vez que la escucho. Y también salen por ahí fotos de Soundcloud, Spotify y Netflix.

ppd: ¡Y [Dilbert](http://dilbert.com)! Si no has leído a Dilbert deja lo que estés haciendo ahora mismo (umh... ¿leer esto?) y [ponte a ello](http://www.businessinsider.com/scott-adams-favorite-dilbert-comics-2013-10).






