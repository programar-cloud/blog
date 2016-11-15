---
title: Vamos a diseñar un proyecto con microservicios
date: 2016-12-04T8:50:20+02:00
description: "Presentaremos un proyecto que implementaremos en las siguientes entradas."
slug: vamos-a-diseñar-un-proyecto-con-microservicios
draft: true
tags:
- diseño
- rest
- microservicios
- programación
- java
- springboot
temas:
- Microservicios
niveles:
- Intermedio

disqus_identifier: vamos-a-diseñar-un-proyecto-con-microservicios
disqus_title: Vamos a diseñar un proyecto con microservicios
disqus_url: //programar.cloud/post/vamos-a-diseñar-un-proyecto-con-microservicios
---

{{% img src="/media/cloud-money.jpg" alt="Dinero y poder en el cloud" %}}

*TL:DR; Se aprende haciendo: aquí tienes la descripción de un pequeño (pero realista) proyecto.*

## Los requerimientos

La visión es la siguiente: **añadir al blog funcionalidad propia de un LMS (Learning Management System) siguiendo el principio de menos es más**.

Vamos a empezar definiendo unas poquitas historias de usuario que nos servirán para saber qué queremos hacer, cómo priorizarlo y qué arquitectura tendremos que utilizar.

1. CALIDAD_SERVICIO: Como propietario del producto deseo que pueda escalar de forma ilimitada manteniendo una latencia reducida para ofrecer una experiencia óptima.
2. AUD: Como responsable de seguridad deseo que las acciones de los usuarios sean auditables para rastrear posibles abusos.
3. LOGIN: Como responsable de seguridad deseo que los usuarios puedan autentificarse para poder mantener su estado dentro del sistema.
4. PROGRESO_ESTUDIANTE: Como estudiante de un curso deseo poder conocer rápidamente qué lecciones he completado para facilitar mi progreso.
5. PROGRESO_PROFESOR: Como tutor de un curso deseo poder ver un resumen del progreso de los alumnos para poder ayudarles proactivamente.
6. PROGRESO_CURSOS: Como propietario del producto deseo poder obtener una visualización global de la utilización de cada lección y curso para conocer su popularidad y actuar en consecuencia.

Vale, suficiente para empezar. El objetivo del proyecto está claro y los requerimientos del mismo también. Y sí, sí, aprovechando que el Pisuerga pasa por Badajoz (o como se diga) aprovecho para añadir unas funcionalidades al blog que creo que son imprescindibles del todo para darte un buen servicio.

## Arquitectura general

Molaría decirte ahora que vamos a montar una aplicación monolítica con Java EE. Para ver que cara ponías. Pero como no tienes la webcam encendida lo dejamos en que crearemos microservicios que publicarán un API REST que será consumida por un cliente web integrado en el propio blog. Usaremos Spring Boot en una primera versión y desplegaremos obviamente en cloud. Obviamente. Para garantizar la historia CALIDAD_SERVICIO no guardaremos estado en los nodos y de esta manera podremos escalar horizontalmente. Calma, lo explicaremos paso a paso.

## El diseño básico

---
¡ACTIVIDAD! Para un momento. Coge un lápiz y una hoja de papel. Es eso que tienes por ahí guardado y que pinta por uno de los extremos. Ponte un cronómetro y dedica cinco minutos a esbozar cómo podrías dividir este problema en piezas independientes. Luego podemos seguir.
---

Algunos microservicios son evidentes, corresponden claramente a las historias PROGRESO_ESTUDIANTE, PROGRESO_PROFESOR, PROGRESO_CURSOS. Pero aún así plantean una pregunta interesante de arquitectura: dado que comparten información ¿debemos agruparlos en una única unidad? ¿debemos escribir microservicios independientes que se comuniquen por http? ¿utilizamos la base de datos como un mecanismo de intercambio de información? 

En el vídeo te comento cómo soluciono habitualmente este tipo de decisiones (TODO: gritar "es una decisión de diseño"). En principio la última de ellas deberías descartarla: acoplar a nivel de base de datos suele ser una muy mala idea y la regla de *microservicios que se comunican por canales tontos* debería estar siempre presente. Así que ¿uno, dos o tres servicios? A primera vista parece que en el fondo estamos manipulando un único recurso (los cursos en sí) y que la diferencia entre las funcionalidades corresponde básicamente a las operaciones que realizamos sobre ellos. Así que ya tenemos nuestro primer componente.












