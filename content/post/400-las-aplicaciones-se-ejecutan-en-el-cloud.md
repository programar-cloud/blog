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
disqus_url: http://javier-moreno.com/posts/el-cloud-es-donde-se-ejecutan-las-aplicaciones
---


{{% img src="/media/speed_by_sean_macentee_smemon.png" alt="cloud es velocidad" %}}


*TL;DR: con la generalización del cloud público la velocidad a la que nuestras aplicaciones evolucionan se dispara.*


Mi primer ordenador fue un [Spectrum +3A](http://www.old-computers.com/museum/computer.asp?st=1&c=222), una máquina con 128KB (kilobytes, no megabytes, no gigabytes) de memoria y ¡disquetera! Con ella aprendí Basic y pasé muchas horas jugando al [Ping Pong](https://www.youtube.com/watch?v=dCa_JaeG4Q4). Después vino [mi 286](https://www.flickr.com/photos/pato4sen/8685843523) con un megabyte de RAM y su disco duro de 40MB. Fue con la que aprendí a escribir programitas con Turbo Pascal. Mis padres me compraron las dos máquinas y para ellos fue un esfuerzo económico importante. Unos cuantos años más tarde un compañero de trabajo y yo tuvimos que *apropiarnos* de un servidor para poder poner en marcha el proyecto en el que habíamos trabajado durante un par de meses porque el ordenador que la empresa había comprado no terminaba de llegar y estábamos ya fuera del plazo de entrega. No, no nos despidieron. Porque no se dieron cuenta.
<!--more-->

## Desplegar en el cloud

*Fastforward:* la semana pasada como parte de mi trabajo de *evangelista* en [Capside](http://capside.com) mostré una pequeña demo en un clúster de ocho máquinas situadas físicamente en Amsterdam. Era solo una demo para una charla, así que tras unas horas ya no las necesitaba... simplemente las apagué y dejaron de cobrarme por ellas.

En esta última anécdota hay varias cosas interesantes pero que no son, para nada, las características más sexies del cloud. La primera es que no tuve que convencer a mis padres para que me comprasen un ordenador ni tuve que aprovechar un despiste para tener el servidor: simplemente **utilicé lo que necesitaba mientras lo necesitaba**. La segunda es que solo **pagué por el uso** que hice, es decir, que alquilé en vez de comprar. En lugar de 8 máquinas podría haber lanzado 40 y el gasto habría seguido siendo de menos de diez euros. Mi capacidad para experimentar y probar nuevas tecnologías se ha disparado desde que entré en este mundo.

Pero ¿sabes lo realmente increíble para mi? Que en ningún momento necesité conocer los detalles sobre el sistema operativo de esas máquinas. Ni cómo estaba montado el cableado de la red. Ni tuve que tocar ficheros de configuración en el balanceador de carga (la máquina que hace de punto de entrada en el sistema). Lo único que hice fue escribir un programa de cinco líneas con instrucciones del tipo "quiero crear un grupo de máquinas" y "arráncame un clúster de esta clase". Es decir que **¡montar mi datacenter se ha convertido en un ejercicio de programación!**

Si eres *developer* y te paras a pensar en esta frase durante un momento te darás cuenta de que lo cambia todo: ahora la infraestructura que utiliza tu aplicación se ha convertido en parte de tu proyecto, en un programita más: una serie de instrucciones que configuran lo que antes tardabas días o meses en tener disponible. Y puedes ejecutarlas las veces que quieras para crear un entorno de pruebas o en un escenario de recuperación de desastres. Cuando ya no la necesitas ejecutas otro miniprograma que lo elimina todo. 

Desde mi punto de vista el elemento clave que define el cloud es este: igual que tienes librerías de programación que puedes usar en tu programa para solucionar problemas que no dominas también tienes librerías que te permiten construir un datacenter completo sabiendo solo cómo invocar sus operaciones. Y **ni siquiera tienes que tener mucha experiencia en sistemas** para lanzar un balanceador de carga o una cola que repartan trabajo entre grupos de máquinas: puedes atreverte con arquitecturas mucho más sofisticadas sin pasar por una curva de aprendizaje difícil. Por eso ahora es mucho más fácil dar servicio a centenares de miles o millones de usuarios pagando solo por lo que gastas en cada momento. Siempre que aprendas a **diseñarlas pensando en en el cloud**, es decir, que sean *cloud native*.

Así que ya sabes, si vas a desarrollar software la infraestructura que necesitará tu proyecto para ejecutarse también formará parte del mismo. Y si has pasado años cuidando y configurando máquinas ahora te va a tocar aprender a programar: la barrera entre *devels* y *sysops* se diluye cada día que pasa más. 

Sea como sea, te lo vas a pasar bien. Quiero que este blog esté enfocado a enseñarte a sacar partido de esta revolución, a crear programas que desde el principio estén pensados para aprovechar el cloud. Por eso lo he llamado *Programar en Cloud*... pero no te engañes, en muy poco tiempo la coletilla sobrará porque simplemente este va a ser el entorno natural de todo lo que desarrolles. 


