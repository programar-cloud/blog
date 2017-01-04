---
title: Arquitectura del primer proyecto
date: 2016-12-11T20:00:20+02:00
description: "Presentaremos un proyecto que implementaremos en las siguientes entradas."
slug: arquitectura-del-primer-proyecto
draft: false
tags:
- diseño
- arquitectura
- rest
- microservicios
- programación
- java
- springboot
- ranting
temas:
- API
niveles:
- Intermedio

episode : "11"
audio : "https://ia801503.us.archive.org/1/items/arquitectura-del-primer-proyecto/arquitectura-del-primer-proyecto.mp3"
media_bytes : "14943314"
media_duration : "18:51"
images : ["https://programar.cloud/media/cabras.jpg"]
explicit : "no"


disqus_identifier: arquitectura-del-primer-proyecto
disqus_title: Arquitectura del primer proyecto
disqus_url: "https://programar.cloud/post/arquitectura-del-primer-proyecto"
---

{{% img src="/media/cabras.jpg" alt="Dos cabras escocesas" %}}

*TL:DR; Se aprende haciendo: aquí tienes la descripción de un pequeño (pero realista) proyecto.*

{{% archive "que-son-los-microservicios" %}}

## ¿Qué vamos a hacer?

Primero voy a ponerme distintos gorritos para ir presentándote un proyecto. Lógicamente es una caricatura (espero que seas indulgente con los detalles) pero tendrá la suficiente complejidad como para que vayamos practicando los patrones de los que quiero hablar.<!--more-->

Va a ser más divertido si pruebas las cosas que lees y si te paras a hacer las actividades que van saliendo. Y como siempre, no te cortes en los comentarios compartiendo problemas y experiencias.

## Los requerimientos

Viernes tarde. Ya estás saliendo por la puerta de la ofi cuando de repente entra el jefe totalmente on fire. Se acerca al equipo y con una gran sonrisa grita "¡tenemos la pasta!". En unos segundos descifras que ha conseguido la financiación necesaria para arrancar el proyecto que tiene que mejorar la experiencia de los estudiantes en la plataforma de eLearning. Con la mirada perdida en el horizonte de los GRANDES PLANES nos transmite la misión del nuevo producto: **añadir al blog funcionalidad propia de un [LMS](https://es.wikipedia.org/wiki/Sistema_de_gesti%C3%B3n_de_aprendizaje) (Learning Management System) siguiendo el principio de menos es más**.

Bueno, en realidad lo que ha pasado es que [Josep](http://twitter.com/josep) me ha dejado los viernes libres, mi mujer se ha resignado a comer macarrones ese día de la semana y la niña está en el cole. Así que puedo dedicar unas horas a este proyecto. Pero cuando te pregunten tú explica lo que te cuento en el párrafo anterior porque [la épica fundacional](http://www.makeuseof.com/tag/apple-didnt-start-garage-google-hp-amazon/) es importante.

{{% imgur glM0nyT "22 años después, la misma sensación" %}}

El lunes por la mañana se lleva a cabo la reunión de planificación. El jefe toma el rol en este caso de *product owner* y ha hecho los deberes: viene con una serie de tareas en la lista del *product backlog* priorizadas según la importancia de cada una. El *equipo* invierte un tiempo discutiendo con él en qué consisten, aclarando el significado general y pidiendo café. Tampoco es un interrogatorio exhaustivo porque al fin y al cabo el *product owner* **irá contestando las dudas conforme vayan surgiendo**. El *scrum master* se pasa la reunión haciendo café para todos y masajeando la espalda de quienes lo piden.

Tras aclarar el significado de cada tarea el equipo utiliza [cartas](//www.scrummanager.net/bok/index.php?title=Estimaci%C3%B3n_de_p%C3%B3quer) para estimar la duración de las que se encuentran al principio del product backlog y que por lo tanto son más importantes o urgentes. Por tercera vez se le comenta a uno de los juniors más jóvenes que [esa carta](http://albertofernandez.canaldenegocio.com/cartas-de-estimacion-agiles-scrum-para-el-verano/) no implica la ingestión de alcohol necesariamente.

{{% imgur "yU9JpTe" "Organiza tu barbacoa con postits" %}}

Las tareas que claramente no dará tiempo de implementar en un primer *sprint* de tres semanas se dejan para la siguiente ronda. Por último los miembros del equipo se autoasignan las tareas que más les apetece llevar a cabo o para las que se consideran más capacitados y las transforman en sencillas *historias de usuario*. El más motivado del grupo gasta una hora en rellenar miles de postits de colorines y empapelar compulsivamente con ellos la pared. Y es tiempo bien invertido.

Vale, si ésta es tu primera aproximación a Scrum no habrás entendido nada. Pero no te preocupes, tengo un vídeo con el que podrás conocer más detalles sobre los roles y artefactos de los que he hablado: **Scrum en dos minutos** (un clásico). Y si realmente quieres que dedique algunas entradas a explicar este framework con más detalle deja un comentario o [mándame un tuit](//twitter.com/ciberado).

{{% youtube WxiuE-1ujCM %}}

En cualquier caso el resultado (simplificado) es el siguiente *sprint backlog*:

- UI: Como experto en usabilidad deseo que las nuevas funcionalidades se integren con la maravillosa interface de usuario ya existente (que en este caso son páginas web estáticas) para que los usuarios encuentren natural utilizar el nuevo producto.
- CALIDAD_SERVICIO: Como propietario del producto deseo que éste pueda escalar de forma ilimitada manteniendo una latencia reducida para ofrecer una experiencia óptima.
- AUDITORIA: Como responsable de seguridad deseo que las acciones de los usuarios sean auditables para rastrear posibles abusos.
- LOGIN: Como responsable de seguridad deseo que los usuarios puedan autentificarse para poder mantener su estado dentro del sistema.
- PROGRESO_ESTUDIANTE: Como estudiante de un curso deseo poder conocer rápidamente qué lecciones he completado para facilitar la autogestión de mi progreso.
- COMPLETAR_UNIDAD: Como estudiante deseo poder informar de que he completado una unidad didáctica para recordar mi progreso a lo largo de un curso.
- PROGRESO_PROFESOR: Como tutor de un curso deseo poder ver un resumen del progreso de los alumnos para poder detectar a los que se queden descolgados y ayudarles proactivamente.
- PROGRESO_CURSOS: Como administrador de cursos deseo poder obtener una visualización global de la utilización de cada curso y unidad lectiva para conocer su popularidad y actuar en consecuencia.

Vale, ya hay más que suficiente para empezar. El objetivo del proyecto está claro y los requerimientos del mismo también. Y sí, sí, aprovechando que el Pisuerga pasa por Badajoz (o como se diga) añadiremos unas funcionalidades al blog que creo que son imprescindibles del todo para darte un buen servicio. ¡Que comience el sprint!

{{% activity %}}
¡ACTIVIDAD! Para un momento. Coge un lápiz y una hoja de papel. Es eso que tienes por ahí guardado y que pinta por uno de los extremos. Ponte un cronómetro y dedica cinco minutos a esbozar cómo diseñarías esta aplicación, que recursos básicos vas a manipular. Luego podemos seguir.
{{% /activity %}}

## Diseño inicial

Por un lado tenemos la historia de CALIDAD_SERVICIO que viene a ser un requerimiento que tendremos que tener en cuenta en la arquitectura del sistema de información. En realidad en general siempre deberías diseñar tus proyectos para que tengan un buen rendimiento independientemente del número de usuarios porque tampoco es tan difícil (ya entraremos en detalles) y porque nunca sabes cómo evolucionarán en el futuro. Escalar horizontalmente añadiendo hardware es muchísimo más barato que escalar verticalmente comprando una mula más grande pero solo se puede hacer si desde el principio lo tienes en cuenta.

> Escalar horizontalmente añadiendo más hardware es muchísimo más barato que escalar verticalmente comprando una mula más grande.

Si nos fijamos en la historia de LOGIN se puede implementar independientemente de todo lo demás con toda probabilidad: ya tenemos un microservicio identificado, relacionado con la gestión de usuarios. Y la de AUDITORIA es un cross-concern que tiene que aplicarse a cualquier acción que se lleve a cabo. De momento dejaremos para más tarde estas tareas: quiero llegar al turrón cuanto antes y alrededor de él construir todo lo demás.

Y el turrón está en las historias más enfocadas a negocio que en este caso corresponden claramente a PROGRESO_ESTUDIANTE, COMPLETAR_UNIDAD, PROGRESO_PROFESOR y PROGRESO_CURSOS. Si te paras a pensar en ellas las operaciones relacionadas serán básicamente las que nos permitan apuntar que un estudiante ha completado una unidad lectiva y consultar esa información tanto a nivel de unidades en un curso como a nivel de estudiante. Bien, pues el equipo toma la decisión de crear un segundo microservicio para solventar esta parte.

{{% imgur s3LLrhU "Elige cómo quieres palmarla" %}}

Aunque estaría muy divertido utilizar [Rust](https://wiki.theory.org/YourLanguageSucks#Rust_sucks_because), [Go](https://wiki.theory.org/YourLanguageSucks#Go_sucks_because) o [Clojure](https://wiki.theory.org/YourLanguageSucks#Clojure_sucks_because) para implementarlo tampoco nos vayamos arriba: tras una pequeña discusión el equipo decide que para llevar a cabo una primera prueba de concepto vamos a priorizar una aproximación conservadora que maximizará las posibilidades de éxito al integrar el conocimiento intrínseco de una arquitectura clásica ya existente, por lo que elegiremos [Java](https://wiki.theory.org/YourLanguageSucks#Java_sucks_because). Sí, amigos y amigas, tengo un pasado en consultoría y el lado oscuro de la fuerza se mantiene poderoso en mí aunque de momento lo tenga bajo control. Además, no conozco ninguno de esos tres lenguajes fashion que os tienen enamorados, aunque tengo pendiente chafardear Go.

> Va a ser muy interesante porque verás que sin hacer cambios en tu arquitectura actual puedes sacar mucho partido del cloud. Palabrita.

Vamos, en resumen, que la primera versión la implementaremos de forma bastante tradicional, como el 95% de las aplicaciones que has visto. Y deja de abuchear y llorar porque incluso así va a ser muy interesante porque verás que sin hacer cambios en tu arquitectura actual puedes sacar mucho partido del cloud. Palabrita. Y spoiler: cuando hayamos terminado lo tiraremos todo y lo reconstruiremos con un enfoque totalmente distinto.

Lo que sí debemos tener muy claro es que nuestro sistema expondrá una API REST y que el cliente web utilizará Javascript para actualizar el estado de las pantallas. Aprovecho para pedirte que si alguien te comenta que haciendo esto el posicionamiento en Google queda perjudicado gravemente o que no se cumple con la normativa de accesibilidad me lo mandes para que tenga una conversación con dicha personita. No volverá a molestarte: primero porque [Google renderiza la pantalla antes de indexarla](http://searchengineland.com/tested-googlebot-crawls-javascript-heres-learned-220157) (incluyendo la ejecución del Javascript), segundo porque desde ~~2003~~ 2006 [Javascript se considera una tecnología perfectamente aceptable en el aspecto de usabilidad](http://alistapart.com/article/tohellwithwcag2) (si se utiliza correctamente, como todo) y, tercero, porque ya tengo bastante práctica en gestionar con la mano abierta a este tipo de fundamentalistas.

## Elecciones tecnológicas

Advertencia: como te decía al principio vamos a usar este primer proyecto como una excusa para crear una arquitectura cloud y los detalles de implementación en sí no van a tener demasiada importancia para seguir el track principal del curso. Así que si las opciones propuestas no son tu veneno, calma: no necesitarás profundizar en ellas. Pero si trabajas con los productos que utilizaremos tengo planeado publicar un par de entradas especiales explicando paso a paso cómo programar la aplicación. No te las pierdas, seguramente van a cambiar tu calidad de vida. A mejor. Seriously.

Recuerda que el cliente ya nos viene impuesto (maldita sea, estás usándolo en este momento). Básicamente se trata de páginas HTML estáticas generadas con ese maravilloso proyecto que es [Hugo](//gohugo.io). Añadiremos una capa de Javascript para dotarlo de vida. En algún momento aprovecharé para contarte cómo publico el blog por cuatro duros al mes, qué es una CDN, cómo funciona CORS y JSONp, por qué Wordpress es matar moscas a cañonazos, etc.

{{% imgur "0gLfh14" "" %}}

Como te decía la lógica de negocio vamos a escribirla en Java. ¡Espera, no huyas! Java vuelve a molar. Un día te cuento cómo ha evolucionado mi relación con esta plataforma a lo largo de dos décadas ¡pero ahora mismo vuelve a gustarme mucho! Java 8 tiene una sintaxis tolerable, el rendimiento de la JVM es muy (muy) bueno una vez superado el bootstrapping y sobre todo Java mola porque existe [Spring Boot](//spring.io). Este framework de Pivotal es en mi modesta opinión la opción más madura para crear aplicaciones cloud nativas. No nos acercaremos a Java EE si no es para rajar a dolor sobre ella y sobre Oracle. Así la compre IBM y le haga lo mismo que hizo ella con Sun. Perdón, ya me estoy calentando.

En cualquier caso haré mucho hincapié en cómo se crea una API REST, en lo importantes que son los tests, en que hay que generar un único artefacto de despliegue, en que debe ser posible inyectar la configuración y en que solo si no guardamos estado en el servidor de aplicaciones vamos a garantizar la escalabilidad horizontal. Todo ello con su poquito de delivery continuo.

Para la persistencia utilizaremos PostgreSQL: es un producto maduro, tiene una comunidad y un soporte a toda prueba, puede desplegarse en AWS como base de datos gestionada (RDS) y es compatible con casi cualquier lenguaje de programación. No quiero convertir este blog en un curso generalista de programación así que no insistiré en que las bases de datos relacionales son en el fondo tecnología legacy del siglo pasado y que están pensadas para brillar en la época en la que los discos duros eran pequeños brazos robóticos que giraban sobre cilindros susceptibles a campos magnéticos. Solo lo comentaré por encima cinco o seis docenas de veces.

> Ojo, no te equivoques: admiro muchísimo a dónde se ha conseguido llegar con un modelo de representación de datos tan pobre como las claves foráneas.

Ojo, no te equivoques: admiro muchísimo a dónde se ha conseguido llegar con un modelo de representación de datos tan pobre como las claves foráneas. Y desde luego cuando me jubile dentro de unas décadas seguirán teniendo un papel muy relevante, igual que COBOL. Pero si vamos a dedicar energía a esta capa física va a ser sobre todo porque por la naturaleza de la propia tecnología supondrá el cuello de botella más importante de todo el despliegue a nivel de rendimiento, escalabilidad y gestión.

## Infraestructura

Lo más relevante es que automatizaremos completamente el despliegue tanto del software como de los servidores que harán falta. Y en alta disponibilidad con autoescalado... si es tu primer autoescalado, vas a flipar. En princio lo haremos en AWS pero si tenemos tiempo os contaré cómo llevarlo a cabo también en Azure.

## Próximamente

Ok, ya tienes el roadmap. Esta semana es un poco extraña porque he cogido unos días y estoy viajando con la familia a Escocia para ver castillos, monstruos y ovejas lanudas (de hecho escribo este post en el avión). Y la siguiente entro directamente en modo berserker porque los finales de año suelen ser intensos en [CAPSiDE](//capside.com). Pero vamos a empezar a picar código ya, mientras hablamos sobre webAPIs REST. Empieza el rock'n'roll, stay tuned.


jv

pd: La imagen del post muestra a un usuario de Oracle que siguen defendiendo que la suya es la mejor solución para almacenar el estado del sistema junto con un developer al que solo le interesan los lenguajes de programación creados hace menos de tres meses. La música de la entradilla del podcast es de Marcus. Imposible no sonreír cuando la escuchas.

ppd: ¡Dale a los botones de compartir! Porque mientras más seamos más fácil será que el cursoblog sea sostenible. Si lees esto usando una pantalla grande los tienes a la izquierda. Si utilizas el móvil los tienes abajo. Y si no, pues copia y pega en Twitter el link al post, que tampoco es tanta faena ;-)

pppd: He puesto otra tira de Dilbert. Y te lo digo de verdad: he trabajado con todos y cada uno de los personajes que salen en su universo. Lo único que no tengo claro es cuál de ellos soy yo. También he puesto una tira de [Sandra and Woo](http://www.sandraandwoo.com/2015/12/24/0747-melodys-guide-to-programming-languages/). Tienen [unas poquitas tiras sobre una developer llamada Melody](http://www.sandraandwoo.com/tag/melody/) que me encantan.

ppppd: La foto de la barbacoa es de [Henrik Kniberg](https://twitter.com/henrikkniberg) y enseña cómo puedes utilizar [Kanban](https://es.wikipedia.org/wiki/Kanban_(desarrollo))  para organizar prácticamente cualquier cosa en esta vida. Tiene una presentación sobre [agilidad en casa](http://documents.tips/documents/henrik-kniberg-agile-at-home.html) espectacular. En [su blog](http://blog.crisp.se/2015/06/07/henrikkniberg/no-i-didnt-invent-the-spotify-model) puedes leer un montón de cosas interesantes sobre (por ejemplo) cómo funciona Spotify.

pppppd: El gran [Tomàs Manzanares](//twitter.com/tomasmanz), compi en CAPSiDE, amigo y mi referente en el mundo del podcasting con su [Mossega](http://mossegalapoma.cat) y [Zetatesters](http://zetatesters.com) me aconsejó un enfoque diferente para esta parte del blog. El suyo era más emocionante (basado en *serverless*) pero al final he preferido hacer las cosas poco a poco porque me será más fácil estructurarlas. Espero no perderle como lector/oyente! Y vosotros, si no le escucháis, ya estáis tardando.
