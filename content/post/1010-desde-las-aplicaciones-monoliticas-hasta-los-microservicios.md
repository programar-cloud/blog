---
title: Desde monolíticas hasta microservicios
date: 2016-11-07T8:50:20+02:00
description: "Un recorrido rápido sobre la evolución que otras empresas han hecho (y que tú también harás) hacia microservicios."
slug: desde-monoliticas-hasta-microservicios
draft: false
tags:
- arquitectura
- conceptos
- agilidad
- microservicios
- programación
temas:
- Conceptos
niveles:
- Iniciaciación

disqus_identifier: desde-las-aplicaciones-monoliticas-hasta-los-microservicios
disqus_title: Desde monolíticas hasta microservicios
disqus_url: https://programar.cloud/posts/desde-monoliticas-hasta-microservicios
---

{{% img src="/media/almacen.jpg" alt="almacén lleno de stock" %}}


*TL;DR: Tenemos que ser conscientes de que seguimos pensando igual que hace unos años cuando las limitaciones tecnológicas son ahora otras.*

¿Cuánto tiempo llevas en el negocio? ¿Recuerdas cuando los servidores eran máquinas con dos procesadores y 128MB de RAM? Párate un momento a pensar sobre esto porque es importante: hace unos años era difícil conseguir hardware e incluso el que utilizábamos en producción tenían menos potencia que el teléfono que llevas en tu bolsillo. Además el acceso a internet era limitado y las aplicaciones que desarrollábamos solían trabajar en red local y soportar un número pequeño de usuarios. Teníamos que **aprovechar al máximo el hierro disponible** y por ejemplo en entornos Java no podíamos arrancar más de una máquina virtual en un ordenador porque no teníamos suficiente RAM. Por ello nació el concepto de *servidor de aplicaciones* que básicamente  permitía ejecutar de forma más o menos aislada varios componentes dentro de la misma *java virtual machine*.<!--more-->

> El *bootstrapping* podía llegar a durar decenas de minutos. La parte buena era que podías escaparte a la cafetería sin remordimientos.

Todo el ciclo de vida del software se basó en esta idea: aplicaciones que se lanzaban como librerías cargadas dinámicamente dentro de un proceso principal extra pesado. Y créeme, cuando digo pesado me refiero a que el *bootstrapping* podía llegar a durar decenas de minutos. La parte buena era que podías escaparte a la cafetería sin remordimientos.

Esto tiene consecuencias a todo lo largo del desarrollo del proyecto: todas las aplicaciones del servidor estaban obligadas a usar la misma pila (sistema operativo, versión de la jvm, versión del servidor de aplicaciones), se producían colisiones entre las versiones de las librerías que utilizaba cada aplicación, si una aplicación consumía muchos recursos afectaba al rendimiento de todas las demás, etc etc.

En este escenario una buena arquitectura de software incluía el concepto de separación en módulos y comunicación por interfaces mediante [value objects](https://en.wikipedia.org/wiki/Value_object). En teoría esto reducía el acoplamiento: si un módulo solo puede hablar con otro mediante objetos específicos en cualquier momento se podrían separar de forma limpia unos de otros con la única condición de que se siguiesen utilizando esos objetos para conectarlos. 

En la práctico esto suponía que o bien **los desarrolladores eran profundamente infelices** creando continuamente objetos cuyo único sentido en la vida era transportar datos entre capas del mismo programa o bien al final se terminaba haciendo uso de los mismos objetos en todos los módulos. Y claro, unos meses después resultaba imposible romper la aplicación en piezas más pequeñas porque básicamente la reutilización de un componente arrastraba indirectamente a todos los demás. 

{{% imgur "L4ZfFyt" %}}

Esto sucedía con casi todo, por ejemplo con la clase *Cliente*. Ah... la clase *Cliente*. No quieres ver lo que yo he visto, no quieres pelearte con una estructura que almacena más de cien atributos porque termina usándose en cualquier contexto posible del programa. Atributos que obviamente en su mayoría no entiendes porque ni tú ni nadie más controla todos los aspectos de **una aplicación que se ha creacido hasta convertirse en un monstruo**. 

> En otras palabras: terminamos haciendo exactamente lo contrario de lo que cualquier manual de buenas prácticas de los años 80 nos decía.

En otras palabras: terminamos haciendo exactamente lo contrario de lo que cualquier manual de buenas prácticas de los años 80 nos decía. Creamos programas gigantes y complejos, responsables de implementar todo tipo de funcionalidades que ni siquiera se encontraban relacionadas entre sí ¡y contra una única base de datos! ¡Pero si era obvio que tarde o temprano ahí ibas a tener un cuello de botella! 

Espera, **déjame que siga recordándote otras decisiones de arquitectura típicas**: si la aplicación se ejecuta en una única máquina, vamos a guardar el estado de la sesión de usuario en la memoria de la misma. ¿Por qué no? Metemos allí su nombre, su color de fondo preferido y ya puestos los datos del carrito de la compra y los productos que ha elegido. 

{{% img src="https://i.imgflip.com/1dxw2i.jpg" alt="nunca montes stateful servers" small="true"%}}

Ok, el sistema empieza a tambalearse así que ahora hemos comprado otras dos máquinas más y queremos balancear entre ellas a los usuarios. No pasa nada, replicamos la sesión utilizando [multicast](todo). Claro que sí. ¿Te has preguntado por qué demonios [JBoss](todo) requería multicast para funcionar? Exacto. **En esta industria tenemos mucha tendencia a solucionar un problema con la opción más elegante por muy poco práctica que resulte**. Pero es que además utilizar multicast con un par de nodos puede funcionar pero cuando llegas a desplegar 100, 200 o 400 (como hace alguno de los clientes que tenemos en [Capside](http://www.capside.com)) lo único que terminas consiguiendo es una denegación de servicio autoinflijida por el tráfico de red. Y eso si el proveedor te lo permite: AWS, por ejemplo, no acepta tráfico multicast en su red. Con buen criterio.

El por qué tendemos a amar soluciones terribles creo que tiene varias explicaciones. La primera es **nuestra falta de espíritu crítico**: si mientras estás aprendiendo ves una y otra vez el mismo patrón llegas a pensar que es la única forma correcta de hacerlo. La segunda es que forzar una tecnología al máximo es difícil, necesitas un conocimiento avanzado que te ha llevado mucho tiempo adquirir y **es por lo tanto muy humano resistirse a aceptar que simplemente hay soluciones mejores y más sencillas**. La tercera (nada despreciable) es que suele ser mucho más fácil cobrar cantidad altas de dinero por una solución compleja que por otra igual de buena pero menos sofisticada. 

>¿Y qué velocidad puedes alcanzar cuando la prueba definitiva de que has hecho algo bien [...] se lleva a cabo una vez al mes en el mejor de los casos?

¿Y cómo afectaba esto al workflow de desarrollo y despliegue? Ya lo sabes: una nueva actualización de la aplicación suponía un desafío. Si tenías suerte y no había que tocar el esquema de la base de datos (que típicamente compartían todas las aplicaciones) solo tenías que molestar a todas las máquinas del clúster. Por el cambio que fuese. ¿El color de un botón? Bien, redespliega 140MB de aplicación en cada nodo. ¿Un error tipográfico en un mensaje? Sí, sí: otro tanto. ¿Y qué velocidad de innovación puedes alcanzar cuando la prueba definitiva de que has hecho algo bien (el uso de tu producto por parte del usuario final) se lleva a cabo una vez al mes en el mejor de los casos por la dificultad de despliegue?

Échale un ojo a la foto que encuentras al principio del post, un clásico. ¿Qué es lo que ves ahí? Exacto, es dinero retenido. El guardar un producto en *stock* no deja de ser básicamente un desperdicio tanto para el consumidor como para el vendedor. El primero no puede disfrutarlo y el segundo ha pagado por él sin recibir nada a cambio. ¿Ves dónde quiero ir a parar? Eso es: **el código que no has pasado a producción es tu stock**.

{{% img src="/media/angry-face-meme.jpg" alt="cara enfadada" small="true" %}}

Y no lo olvides, todo esto partió de una necesidad física, un condicionante tan importante como la ley de la gravedad: la falta de memoria y de hierro en general. El no disponer de infraestructura de forma ágil. Y como nos pasa con la existencia de la gravedad lo asumimos de forma tan natural que hasta hace poco parecía que no había otra manera de trabajar. Incluso cuando resultaron obvias las limitaciones que sufríamos seguimos utilizándolo durante mucho tiempo y todavía hoy en día los servidores de aplicaciones tradicionales suponen un porcentaje enorme del mercado. Sí, amigos y amigas, estamos rodeados de zombies y muchas veces se llaman Weblogic.

>Sí, amigos y amigas, estamos rodeados de zombies y muchas veces se llaman Weblogic.

Las cosas están cambiado radicalmente: no es que tengas recursos ilimitados (aunque según tu modelo financiero a veces el dinero no es un condicionante) pero lo que sí resulta imprescindible es ser capaz de recibir feedback rápidamente. Y no estoy hablando de una prueba para el cliente, estoy hablando de poner en funcionamiento el código escrito para que el usuario final determine si le ayuda a realizar su cometido o no. 

En un momento en el como te conté en un {{%ilink "cloud-es-donde-se-ejecutan-las-aplicaciones" "post anterior"%}} levantar una flota de máquinas en el cloud resulta tan fácil como ejecutar una instrucción no tienes ninguna excusa para agrupar varias aplicaciones en un único servidor o para crear un gran monolito imposible de mantener.

> Vuelve a la esencia de Unix.

Así que aquí tienes unos principios básicos: vuelve a la esencia de Unix, vuelve a escribir pequeñas aplicaciones que sean capaces de llevar a cabo una función concreta. Y que lo hagan de forma tan independiente del resto como sea posible a todos los niveles. Utiliza la herramienta (plataforma) más adecuada en cada caso, guarda los datos en el repositorio que mejor se adapte a la estructura de los mismos, haz que la comunicación se base en *tuberías tontas* sencillas que cumplan un contrato hacia el exterior. 

Y gracias a ello vas a tener menos complejidad, va a ser más fácil entender cada pequeño proyecto. Y estas piezas podrán tener su ciclo de vida independiente, testearse de manera independiente y desplegarse de forma independiente en su propia maldito mini-datacenter virtual que evolucionará junto a cada proyecto. No se trata de inventar nada, es solo volver a hacer las cosas bien ahora que la tecnología nos lo permite.

Dale el nombre que quieras a estas prácticas. Las puedes llamar *sentido común*, pero si quieres un nombre más *catchy* di que tu arquitectura está orientada a **microservicios**. Y por supuesto encontrarás problemas que antes no tenías pero te contaré cómo mantenerlos bajo control. Y créeme, esos problemas van a doler... pero no te van a paralizar como hacían los anteriores. Y vas a disfrutar mucho más.

### Conclusiones

Lo que te cuento en este post es tan fácil de entender como difícil de implantar. Pero si hay una idea que deberías repetirte una y otra vez para que no caigamos en los mismos errores es **"desarrolla un espíritu crítico"**. No aceptes una solución solo porque es lo que siempre has hecho, lo que todo el mundo hace o por el *hype* que tiene alrededor. Debemos aprender a abandonar lo que ya sabemos hacer y a aceptar el cambio con ilusión.

¡Ah! ¡Esta semana tenemos también dos vídeos! El primero es un pelín más largo (15min) pero muy interesante. En él haremos un poco de arqueología para entender {{% ilink "la-evolucion-del-coste-del-hardware" "las limitaciones que nos imponía el hardware" %}} hace unos años y lo dramática que ha sido la evolución en este aspecto... si naciste antes de los noventa vas a echar unas risas. El segundo es mucho más cortito (5min) y te enseña {{% ilink "magia-desde-la-linea-de-comandos" "una de esas líneas mágicas de Unix" %}} que orquestan diferentes comandos para hacer un trabajo útil y sofisticado, componiendo instrucciones sencillas ¡Disfruta!


jv

pd: La imagen del post es (creo) de un almacén de Amazon. La música que sirve de cortinilla del vídeo es de [Marcus](https://soundcloud.com/musicbymarcus/promo-music-inspiational) y me hace sonreír cada vez que la escucho.

ppd: El diagrama que encuentras en mitad de la página pertenece a maravilloso blog [DailyWTF](http://thedailywtf.com/articles/Labview-Spaghetti). Súper recomendable.








