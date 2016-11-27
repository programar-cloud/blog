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
disqus_url: "//programar.cloud/post/vamos-a-diseñar-un-proyecto-con-microservicios"
---

{{% img src="/media/cloud-money.jpg" alt="Dinero y poder en el cloud" %}}

*TL:DR; Se aprende haciendo: aquí tienes la descripción de un pequeño (pero realista) proyecto.*

## Los requerimientos

La visión es la siguiente: **añadir al blog funcionalidad propia de un LMS (Learning Management System) siguiendo el principio de menos es más**.

Vamos a empezar esbozando unas poquitas historias de usuario que nos servirán para saber qué queremos hacer, cómo priorizarlo y qué arquitectura tendremos que utilizar.

- UI: Las funcionalidades deben integrarse con la interface de usuario ya existente que en este caso son páginas web estáticas.
- CALIDAD_SERVICIO: Como propietario del producto deseo que pueda escalar de forma ilimitada manteniendo una latencia reducida para ofrecer una experiencia óptima.
- AUDITORIA    : Como responsable de seguridad deseo que las acciones de los usuarios sean auditables para rastrear posibles abusos.
- LOGIN: Como responsable de seguridad deseo que los usuarios puedan autentificarse para poder mantener su estado dentro del sistema.
- PROGRESO_ESTUDIANTE: Como estudiante de un curso deseo poder conocer rápidamente qué lecciones he completado para facilitar mi progreso.
- PROGRESO_PROFESOR: Como tutor de un curso deseo poder ver un resumen del progreso de los alumnos para poder detectar a los que se queden descolgados y ayudarles proactivamente.
- PROGRESO_CURSOS: Como propietario del producto deseo poder obtener una visualización global de la utilización de cada lección y curso para conocer su popularidad y actuar en consecuencia.

Vale, ya hay más que suficiente para empezar. El objetivo del proyecto está claro y los requerimientos del mismo también. Y sí, sí, aprovechando que el Pisuerga pasa por Badajoz (o como se diga) añadiremos unas funcionalidades al blog que creo que son imprescindibles del todo para darte un buen servicio.

## Análisis básico

---
¡ACTIVIDAD! Para un momento. Coge un lápiz y una hoja de papel. Es eso que tienes por ahí guardado y que pinta por uno de los extremos. Ponte un cronómetro y dedica cinco minutos a esbozar cómo podrías dividir este problema en piezas independientes. Luego podemos seguir.
---

Por un lado tenemos la historia de CALIDAD_SERVICIO que viene a ser un requerimiento no funcional que tendremos que tener en cuenta en la arquitectura del sistema de información. Simplemente tenemos que dejarle muy claro al cliente que hay un coste de operaciones asociado a ello.

Por otro la historia de LOGIN se puede implementar independientemente de todo lo demás con toda probabilidad. Y la de AUDITORIA es un cross-concern que tiene que aplicarse a cualquier acción que el usuario lleve a cabo.

Las operaciones puramente de negocio corresponden claramente a las historias PROGRESO_ESTUDIANTE, PROGRESO_PROFESOR, PROGRESO_CURSOS. Pero aún así plantean una pregunta interesante de arquitectura: dado que comparten información ¿debemos agruparlos en una única unidad? ¿debemos escribir microservicios independientes que se comuniquen por http? Y en tal caso ¿utilizamos la base de datos como un mecanismo de intercambio de información? 

Dentro de poco publicaré un vídeo en el que te cuento cómo soluciono habitualmente este tipo de decisiones (TODO: gritar "es una decisión de diseño") pero en principio la última de ellas deberías descartarla: acoplar a nivel de base de datos suele ser una muy mala idea y la regla de *microservicios que se comunican por canales tontos* debería estar siempre presente. Así que ¿uno, dos, tres servicios? ¿Más? A primera vista parece que en el fondo estamos manipulando dos recursos: la visualización de las unidades didácticas y el progreso de los alumnos. 

Por otra parte no queremos que dejar la responsabilidad de invocar y coordinar ambos servicios al cliente porqueque como indica la historia UI será un encantador pero frágil navegador. En otras palabras, nos aseguraremos de que la llamada a un único endpoint: PUT a /alumnos/Alice/cursos/iniciacion/unidad/4?state=COMPLETED indicará que la unidad 4 del curso de iniciación ha sido completada por la alumno Alice.

## Arquitectura general

Molaría decirte ahora que vamos a montar una aplicación monolítica con Java EE. Para ver que cara ponías. Pero como no tienes la webcam encendida no merece demasiado la pena ;-)

Si revisamos la complejidad de negocio de las historias de usuario al menos a primera vista no parece muy alta. Hablando con el product owner (¡yo!) nos comenta que el riesgo implícito en que el proyecto se complique es asumible: en el peor de los casos vais a tener que esperar algunos días más de lo previsto en poder leer la unidad didáctica correspondiente. Por otro lado el product owner nos comenta también que el utilizar una tecnología que tenga proyección de futuro es un valor añadido en la elección y que debemos reducir en lo posible los costes operativos hasta dejarlos por debajo de los diez euros al mes para 10.000 usuarios.

Los encargados de arquitectura del equipo (ok, ok, en este caso también soy yo) se reunen y proponen tres opciones:

* Una arquitectura clásica basada en un balanceador de carga, una muy pequeña flota de servidores ejecutando aplicaciones java basadas en SpringBoot 


lo dejamos en que crearemos microservicios que publicarán un API REST que será consumida por un cliente web integrado en el propio blog. Usaremos Spring Boot en una primera versión y desplegaremos obviamente en cloud. Obviamente. Para garantizar la historia CALIDAD_SERVICIO no guardaremos estado en los nodos y de esta manera podremos escalar horizontalmente. Calma, lo explicaremos paso a paso.












