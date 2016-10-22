---
title: Microservicios en el mundo real
date: 2016-10-21T8:50:20+02:00
description: "Algunos ejemplos de cómo las empresas están aplicando hoy en día arquitecturas orientadas a microservicios"
slug: microservicios-en-el-mundo-real
draft: true
tags:
- arquitectura
- casos
- microservicios
temas:
- Arquitectura
niveles:
- Iniciaciación

disqus_identifier: microservicios-en-el-mundo-real
disqus_title: Microservicios en el mundo real
disqus_url: //programar.cloud/posts/microservicios-en-el-mundo-real
---

{{% img src="/media/amazon-frontpage.jpg" alt="Amazon front page" %}}

*TL:DR; Las aplicaciones cloud nativas basadas en microservicios no son una moda o un ejercicio teórico. Los sistemas de Amazon, Netflix, Spotify, Soundcloud, etc se basan en ellos.*

Quizá no te suene la pantalla que ves arriba. Porque hace unos años te secuestró una nave extraterrestre y acabas de regresar con otras 900 personas (TODO actualiza referencia). Porque en caso contrario seguro que has visitado Amazon en alguna ocasión: es el *retailer* de referencia en el mundo y ya hemos hablado de ellos en más de una ocasión. <!--more-->

Bueno, pues algún detalle extra: ¿cuántos microservicios crees que se coordinan para generar esa pantalla? ¿20? ¿50? Te lo cuento en el vídeo de hoy (calma, es cortito) pero ya te adelanto que alguno más.

Amazon hace un paso a producción en 2016 cada 0.6 segundos. Es decir, que mientras lees este párrafo han lanzado tres o cuatro mejoras en producción. 

Vale, vale, es verdad, soy un pesado con Amazon. Vamos a hablar de Spotify. Te doy algunas cifras: tienen más de 75 millones de usuarios activos, están distribuídos en 58 países, agregan unas 20.000 canciones a su catálogo cada día y almacenan más de dosmil millones de listas de reproducción (!). Pero además imagínate la complejidad que tiene un negocio en el que un usuario de USA y otro de España escuchan la misma canción y los derechos de la misma pertenecen a diferentes compañías.

Desde hace tiempo la arquitectura de Spotify se basa en microservicios que en ocasiones comparten storage. Uno de los patrones que implementan es el de *vistas*: los clientes acceden a la platforma a través de un microservicio más o menos equivalente a una pantalla de la aplicación que es el encargado de invocar a todos los demás componentes y agregar los resultados para retornarlos como un único documento a quien realizó la petición. De esta manera se reduce el tráfico externo (más caro), se simplifica el cliente y sobre todo se mejora la latencia.

En 2016 Spotify cuenta con 600 devels divididos en 90 equipos autónomos y multidisplinares, cada uno de ellos cuidando su propio grupo de microservicios. En total tienen desplegados más de 800. Utilizan principalmente Java para facilitar la movilidad del personal entre equipos aunque últimamente han decidido que adoptarán también otros lenguajes para tareas concretas.

Como otras empresas que veremos han liberado parte de su tecnología como Open Source. Más adelante le dedicaremos algunos post a [Project Apollo](TODO), la pieza más potente e interesante que puedes encontrar en su github.

¿Y Netflix? ¿Es que no vamos a hablar de Netflix? Claro que sí, maldita sea. Si hay una empresa que ha hecho pedagogía de esta forma de construír software es Netflix: su github incluye decenas de herramientas que facilitan el despliegue de microservicios en el cloud. Bueno, en un cloud: AWS. 

Si quieres cifras puedo contarte que en 2016 tienen 50 millones de suscriptores (no usuarios, suscriptores: gente que paga cada mes) en todo el mundo y reciben más de dos mil millones de peticiones a su API desde el exterior cada día, que a su vez generan un gran número de peticiones internas. También es espectacular el que un viernes por la noche en USA el 30% del tráfico de internet en ese país procede de sus servidores (oh, wow).

Además esta gente ha vivido su propia travesía del desierto: en 2008 todo Netflix se desplegaba como un único fichero .war en un servidor de aplicaciones java. Intenta interiorizar esto. TODO NETFLIX. ¿Tú crees que tus puestas en producción son problemáticas? Ellos sí sabían lo que quería decir *problemático*. 

En dos años rompieron ese gigantesco monolito y lo transformaron en decenas (y más tarde, centenares) de microservicios que corren en AWS.

Un punto especialmente interesante de esta empresa es que fueron pioneros en crear herramientas de automatización muy sofisticadas. De hecho, cuando se dieron cuenta de que la consola oficial de AWS no encajaba con sus necesidades (está más orientada a monitorización que a despliegue) crearon un sustituto llamado Asgard mucho más adaptado a su workflow. Y la publicaron como Open Source: en el vídeo que acompaña a este post te cuento más detalles sobre este tema.

Otro ejemplo: en Soundcloud [pasaron de una monolítica escrita en Ruby on Rails a una mezcla de microservicios](//philcalcado.com/2015/09/08/how_we_ended_up_with_microservices.html) desarrollados con Scala, Clojure y JRuby. En lugar de romper la aplicación original en porciones decidieron congelar sus funcionalidades y añadir las nuevas en forma de proyectos independientes. Les ayudó mucho el hecho de que ya estaban basando la comunicación con el exterior en un API bien definida con lo que desde el punto de vista de los clientes no supuso ninguna diferencia y solo más tarde empezaron a desgajar la aplicación original.

Un detalle intereante de su arquitectura es que la invocación de algunos microservicios sigue un patrón asíncrono basado en eventos. Por ejemplo, el añadir un nuevo comentario en una canción hace que se genere un mensaje con dicho evento en una cola RabbitMQ y que esta activamente afecte a los servicios de comentarios y de notificaciones. Si mañana se necesita que el mismo evento tenga un tercer efecto solo hay que añadir un consumidor más a la cola.

¿Y en empresas más cercanas y tradicionales? ¿Se están utilizando estos patrones? En los clientes que tengo más a mano hay de todo, aunque está claro que queda mucho trabajo por hacer. Por ejemplo, los chiquitos que desarrollan varias aplicaciones web que has usado seguro si vives en España están aplicando tanto metodología ágil como técnicas de devops y arquitecturas orientadas a microservicio con muchísimo éxito. Y no estoy hablando de una empresa pequeña y nueva, aunque es verdad que tienen una raíz tecnológica muy fuerte.

Otro cliente con el que he tenido relación está en mitad del proceso de evolucionar desde un horror monolítico sacado del peor círculo infernal de Dante a una arquitectura cloud que sin ser perfecta al menos les está quitando un buen número de problemas. Faltará arreglar la parte de procesos y el cambio cultural asociado. Pero terminarán consiguiéndolo.

Pero en la mayoría de los casos lo que hay es, sobre todo, una conciencia clara de que hay que mejorar lo que tienen. Que hay que conseguir entregar mejor software en menos tiempo. La parte buena es que nunca antes las herramientas para hacerlo han sido tan asequibles. Solo hay que aprender a aplicarlas... y conseguir que los equipos de personas que están en las trincheras interioricen las ventajas de hacerlo.

¡Ah! En los vídeos de hoy te resuelvo el enigma del número de servicios que componen el frontal de Amazon y echamos un vistazo rápido a algunas cuentas de github que tienes que conocer sí o sí. Ya me contarás si te gustan. No, en serio, coméntamelo, que interaccionar con vosotros y vosotras siempre me hace ilusión.

jv










