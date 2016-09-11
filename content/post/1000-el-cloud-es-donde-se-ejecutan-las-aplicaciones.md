---
title: El Cloud es donde se ejecutan las aplicaciones
date: 2016-08-20T19:33:20+02:00
description: "Lee acerca de cómo pasé de tener que confiscar servidores a crearlos bajo demanda programáticamente en el cloud."
slug: cloud-es-donde-se-ejecutan-las-aplicaciones
draft: false
tags:
- cloud
- agilidad
- casos
temas:
- Cloud
niveles:
- Iniciaciación

disqus_identifier: el-cloud-es-donde-se-ejecutan-las-aplicaciones
disqus_title: El Cloud es donde se ejecutan las aplicaciones
disqus_url: http://programar.cloud/posts/el-cloud-es-donde-se-ejecutan-las-aplicaciones
---


{{% img src="/media/highway-by-fancycrave.jpg" alt="cloud es velocidad (por Fancy Crave)" %}}


*TL;DR: con la generalización del cloud público la velocidad a la que nuestras aplicaciones evolucionan se dispara.*


Mi primer ordenador fue un [Spectrum +3A](http://www.old-computers.com/museum/computer.asp?st=1&c=222), una máquina con 128KB (kilobytes, no megabytes, no gigabytes) de memoria y ¡disquetera! Con ella aprendí Basic y pasé muchas horas jugando al [Ping Pong](https://www.youtube.com/watch?v=dCa_JaeG4Q4). Después vino [mi 286](https://www.flickr.com/photos/pato4sen/8685843523) con un megabyte de RAM y su disco duro de 40MB. Fue con la que aprendí a escribir programitas con Turbo Pascal. Mis padres me compraron las dos máquinas y para ellos fue un esfuerzo económico importante. Unos cuantos años más tarde un compañero de trabajo y yo tuvimos que *apropiarnos* de un servidor para poder poner en marcha el proyecto en el que habíamos trabajado durante un par de meses porque el ordenador que la empresa había comprado no terminaba de llegar y estábamos ya fuera del plazo de entrega. No, no nos despidieron. Porque no se dieron cuenta.
<!--more-->

*Fastforward:* la semana pasada como parte de mi trabajo de *evangelista* en [Capside](http://capside.com) mostré una pequeña demo en un clúster Mesos de ocho máquinas situadas físicamente en Amsterdam. Era solo una demo para una charla, así que tras unas horas ya no las necesitaba... simplemente las apagué y dejaron de cobrarme por ellas. Y los chiquitos que asistieron a la charla podrían haber reproducido el experimiento por ellos mismos ¡tras escucharme durante apenas media hora!

Seguramente eres consciente del cambio que una tecnología como esta está produciendo en la manera en la que diseñamos aplicaciones y sistemas: tendrías que haber pasado los últimos dos o tres años viviendo en un bote de mayonesa para no haber leído nada sobre *cloud público*. Pero quizá no hayas tenido todavía experiencia práctica: fuera de USA y UK la penetración real es relativamente pequeña. Quizá tu día a día tenga mucho más que ver con pelear para conseguir hierro que con aprender y experimentar tan rápido como sea posible. Pero esta evolución está llegando de forma acelerada también aquí, lo estoy viviendo en primera persona estos últimos años. Y me gustaría compartir contigo lo que he ido aprendiendo.

En el blog vas a poder leer sobre lo importante que es integrar todas las etapas de desarrollo y operaciones, sobre arquitectura de software basada en microservicios,  automatización de infraestructura, recursos inmutables, técnicas de gestión de calidad, despliegues *blue/green* y en general de lo que necesitas para diseñar y poner en funcionamiento software que de verdad funcione en el cloud de manera *nativa*. Pero sobre todo quiero que compartas mi entusiasmo por todo este mundo. Porque al final lo de menos son los detalles técnicos, lo importante de verdad es cambiar la forma en la que enfocas tu trabajo. Y sé que suena muy a Paulo Coelho pero hey, en serio: eso solo lo podemos conseguir con entusiasmo y pasión.

![Haz caso de lo que dice Javi, Paulo Coelho](/media/paulo-do-what-javi-says.jpg)

Muchas de las entradas del blog van a tener un vídeo asociado porque creo (bueno, sé) que es más fácil aprender viendo y escuchando que leyendo. Además grabándome puedo explicar más cosas en menos tiempo así que dale al play sin miedo. Y no te cortes a la hora de usar la sección de comentarios o de utilizar [twitter](http://twitter.com/ciberado) para ponerte en contacto conmigo: este es un proyecto vivo y evolucionará según tú lo necesites.

Nos vemos muy pronto.

jv

pd: La primera imagen del post es de [Fancy Crave](https://pixabay.com/es/users/fancycrave1-1115284/). La segunda es de un tipo que lleva años viviendo del cuento.
