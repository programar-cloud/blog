---
title: "¿Qué son los microservicios?"
date: 2016-11-18T14:20:20+02:00
description: "Comparamos las diferencias entre una arquitectura clásica y una orientada a microservicios."
slug: que-son-los-microservicios
draft: false
tags:
- arquitectura
- microservicios
temas:
- Conceptos
niveles:
- Iniciación

episode : "8"
audio : ""
media_bytes : ""
media_duration : ""
images : [""]
explicit : "no"

disqus_identifier: que-son-los-microservicios
disqus_title: ¿Qué son los microservicios
disqus_url: "https://programar.cloud/post/que-son-los-microservicios"
---      

{{% img src="/media/micro-machine.jpg" alt="Micromachines" class="framed" %}}

*TL:DR; Piensa en productos, no en servidores o proyectos. Crea programas independientes para cada pieza y únelos con mecanismos simples y tontos.*

### Por qué NO iba a escribir este post

¡Porque ya sabes qué es un microservicio! Ok, el término es relativamente reciente (2013 o 2014) pero a estas alturas seguro que has estado expuesto o expuesta a él. Además no voy a ser yo quien mejore la descripción que hace de esta arquitectura [Martin Fowler](http://martinfowler.com/microservices/) que es un tipo al que hay que escuchar a pesar de que escriba libros técnicos.

Entonces ¿Qué me hizo cambiar de opinión? Exacto: el SEO de Google, principalmente. Bueno, y también el saber que existe una remota posibilidad de que aunque tengas nociones sobre la terminología no acabes de tener claro que entra dentro de la definición y qué no. Así que vamos allá y concretemos un poco.<!--more-->

### Qué NO es un microservicio

Un microservicio NO es un API web. O mejor dicho, el que tu sistema se comunique con el exterior mediante un API no garantiza que estés diseñando microservicios. Si el 30% de la funcionalidad de tu producto la proporciona un único componente existen muchas posibilidades de que este sea un monolito clásico disfrazado de microservicio. Y también existe un 90% de probabilidades de que me haya inventado la anterior cifra... pero te haces una idea de lo que quiero decir. Y fíjate en que **estoy hablando de funcionalidades de negocio**, no de líneas de código. Esa es la unidad de medida de tamaño y complejidad que estás buscando.

Un microservicio NO le habla a un enterprise bus. Es un patrón que se hizo muy popular hace unos años. Básicamente consiste en crear una cola de mensajes centralizada en un middleware (el bus) en el que las aplicaciones escriben peticiones. Estas peticiones (mensajes) se analizan y la cola decide el o los destinatarios de las mismas y se encargar de hacerlos llegar según un sistema de suscripciones posiblemente transformando por el camino el formato y reintentándolo si un primer intento fracasa. Sobre el papel esto aporta gobernanza al sistema (tienes una carretera central a la que aplicar controles) pero en la práctica el equipo encargado de hacerla evolucionar **termina siendo un cuello de botella** que frena al resto y la complejidad del sistema acaba siendo inmanejable. Been there.

> Disponer de un único esquema de base de datos tampoco te aportaba tanto valor.

Un microservicio NO escribe a una base de datos centralizada. De hecho, en la mayoría de los casos, dispone de su propio mecanismo de persistencia. ¿Que otro componente quiere acceder a los datos del servicio? ¡Pues que le pregunte a él, no a su base de datos! Y sí, esto añade cierto grado de complejidad al sistema porque la consistencia global del estado (la información guardada por tu producto) es eventual. Pero hazte a la idea: no siempre puedes tener lo que quieres y a veces simplemente obtienes lo que necesitas. Y lo que necesitas es disponibilidad y resiliencia al particionamiento y un esquema que puede evolucionar de forma ágil. Además, al fin y al cabo, cuando fueses a hacer datawarehousing ibas a transformar esas tablas de todas maneras así que **disponer de un único esquema de base de datos tampoco te aportaba tanto valor**.

{{% imgur "dNnDC7F" "The rolling stones" %}}

Un microservicio NO utiliza Data Transfer Objects y Value Objects para comunicar información entre las capas lógicas que lo implementan. Es decir, el objeto sobre le que aplicas las reglas de negocio es el mismo objeto que finalmente es persistido y posiblemente también sea el objeto que utilizas para devolver una respuesta cuando te pregunten por él y usas decoradores y anotaciones para decidir que se transfiere a las otras capas físicas de la aplicación y qué se queda en memoria. Y ya puestos, si la complejidad del servicio no lo requiere, tampoco te vengas arriba con el número de capas en la que lo divides.

Un microservicio NO se comunica con otro a través de referencias remotas a objetos, lo hace a través de documentos. Nada de RMI, nada de CORBA, nada que añada acoplamiento entre las tecnologías empleadas entre ellos e incremente la complejidad. Tan solo old good documents.

Un microservicio NO usa SOAP, **porque nadie en su sano juicio usaría algo tan complicado** para solucionar algo como interconectar sistemas. REST es mucho más práctico y semánticamente rico. Y eso no quiere decir que tengas que eliminar XML pero probablemente serás más feliz con alernativas como JSON o Protobuffers. O jpeg, si la tarea lo requiere. Idealmente, que elija el consumidor qué formato prefiere.

{{% imgur 35oWpTw "Dilbert y el despliegue" %}}

Un microservicio NO hace todo el trabajo de forma síncrona. Si un componente necesita ponerse en contacto con otros tres para completar la faena todas esas peticiones se lanzan en paralelo y posteriormente se sincroniza el resultado. **Lo contrario impone una serialización de la latencia totalmente inasumible**. Y calma: hoy en día (con promesas, futures, async/await, reactivos y similares) la programación asíncrona es sencilla. Ya verás, dedicaremos un tiempo a jugar con ella.

Un microservicio NO espera a nadie para pasar a producción. Si tus procedimientos dicen que las nuevas versiones de los componentes que implementan tu producto se ponen en servicio los martes por la tarde es que no estás haciendo microservicios. Parte de la gracia es acelerar el ciclo de desarrollo.

Un microservicio NO cambia el contrato generando incompatibilidades: puede aceptar información adicional en las peticiones y responder con más datos pero debe de seguir siendo compatible con los otros componentes que ya lo utilicen.

Un microservicio NO lleva su configuración incrustada como parte del código. Se inyecta desde fuera y hay múltiples formas de hacerlo pero un fichero xml en una subcarpeta del proyecto no es una de ellas porque para empezar hace que se requiera una recompilación para sustituir la configuración usada durante desarrollo cuando se pasa a producción y por lo tanto **el artefacto sobre el que has hecho las pruebas ya no es el mismo que tienes en tu flota principal**. Lee esta última frase otra vez hasta que quede completamente clara.

> Los dioses del Tomcat te maldecirán duplicando las entradas en el log.

Un microservicio NO comparte proceso con otro. Si estás desplegando veinte aplicaciones dentro de tu Websphere eso no son microservicios: no va a poder escalar independientemente de los otros 19 componentes, va a competir con los demás por los recursos, toparás con incompatibilidades entre las librerías que utilices, etc. Y los dioses del Tomcat te maldecirán duplicando las entradas en el log.

Un microservicio NO termina obligando a operaciones a copiar varios archivos para ponerlo en marcha. Si generas más de un fichero usa la estrategia que prefieras para agruparlos de manera que su transferencia sea atómica: zip, war, jar, deb, msi, imágenes docker o lo que te vaya mejor. Pero **solo un artefacto por componente**.

Un microservicio NO se despliega en producción a mano. Nunca. Para nada. Porque cuando son las tres de la mañana tú no quieres tener que levantarte para rearrancar la aplicación. Y porque si hay que poner un hotfix de emergencia mientras toda la oficina arde y el CEO amenaza con trasladar a todo el departamento a Siberia los humanos tendemos a ponernos nerviosos y a fallar. No queremos fallar. Las automatizaciones (bien hechas) no fallan. Pero bueno ¿es que no somos devops, o qué?

{{% img src="/media/keep-calm-and-automate.jpg" alt="keep calm and automate" class="small" %}}

Un microservicio NO es inabarcable para un humano. Si en el equipo que mantiene tu software hay una sola persona que no sea capaz de entender las diferentes responsabilidades de los ficheros que forman el código es que tu componente es demasiado complejo para ser considerado un microservicio. No quiere decir que todo el mundo sea igual de bueno peleando con Hibernate o con CSS pero todos deberían ser capaces de identificar dónde se encuentran los ficheros  relacionado, entender sus roles y aplicar cambios sencillos. **Y sobre todo todos los miembros del equipo deberían de ser capaces de entender los aspectos de negocio que implementa el componente**.

Un microservicio NO se apoya en un framework corporativo de capa de negocio. Si todos tus componentes usan la misma librería que incluye un tipo para describir el concepto de *Cliente*, eso no es un microservicio. Porque en el fondo no todo tu producto tiene la misma visión de lo que es un cliente y porque en el equipo encargado de mantener ese framework **tienes otro cuello de botella**. 

Un microservicio NO se crea mediante un proceso de Waterfall. En serio, lo que quieres conseguir no es tan complejo: no necesitas dedicar varias semanas a planificar perfectamente cómo vas a implementar esa perfecta toma de requerimientos que has llevado a cabo. Si lo que queremos es aportar valor cuanto antes tienes que mantener la calidad por encima de todo pero también debes **abrazar una cultura de agilidad**.

Un microservicio NO deja que otro le diga quién es. Es él quien lo sabe y por lo tanto se registra a sí mismo en las páginas amarillas que elijas: DNS, Eureka, MarathonLB o el veneno que hayas decidido utilizar.

> Si no has implementado mecanismos para dar a tu componente alta disponibilidad no es un microservicio.

Un microservicio NO la palma a las primeras de cambio cuando la máquina que lo contiene tiene un problema. Si no has implementado mecanismos para dar a tu componente alta disponibilidad (IP virtual flotante, tarjeta de red flotante, balanceador de carga, lo que tú necesites) no es un microservicio.

Un microservicio NO se calla los problemas. Si tu componente no es capaz de emitir métricas, logs, KPIs y compañía eso no es un microservicio ni es ná. Vas a tener un incremento en la complejidad de operar estos escenarios porque simplemente hay más piezas así que será mejor que lo pongas fácil a quienes tengan que diseñar la monitorización del sistema. Porque saben dónde vives y tienen mucho carácter.

### Qué es un microservicio

Uff... llevo 1500 palabras. Y tampoco es tan interesante lo que me queda por contarte. Así que ya hablaremos de eso en otro momento. Pero repasa de nuevo los puntos anteriores para saber si no estás haciendo microservicios. Y recuerda: **es posible que eso sea lo que realmente necesitas**. No te olvides de aplicar siempre pensamiento crítico y porque todos te estemos diciendo que debes ir en una dirección al final eres tú quien tiene que decidir si es la que te lleva a donde quieres llegar.

Nos vemos dentro de nada en nuevo post. Y calma, no falta mucho para que nos pongamos a programar como si no hubiese un mañana. Preparad vuestros teclados ya. Bueno, más o menos. Que todavía me quedan un par de cosas que contaros antes.

jv


pd: La foto del post es de un [micromachine](https://es.wikipedia.org/wiki/Micro_Machines) y la he sacado de [la Wikipedia](https://commons.wikimedia.org/wiki/File:Micro_Machines_Comparacion_02.jpg). La música que sirve de cortinilla del vídeo es de [Marcus](https://soundcloud.com/musicbymarcus/promo-music-inspiational) y me hace sonreír cada vez que la escucho. 

ppd: Hay una foto del [mejor grupo de blues y rock de la historia](https://youtu.be/ZRXGsPBUV5g). O al menos, el mejor de entre los que de siempre han tenido más alcohol que sangre en las venas.

pppd: También hay una tira de [Dilbert](http://dilbert.com). Pierdo el candadito verde en la barra de navegación cada vez que enlazo con él, pero merece la pena.

ppppd: Aquí tienes la historia del [keep calm](http://knowyourmeme.com/memes/keep-calm-and-carry-on).

pppppd: Vale Google, si ahora no posicionas bien este artículo yo ya no sé. 





























