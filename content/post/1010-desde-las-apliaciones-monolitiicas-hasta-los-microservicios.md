---
title: Desde monolíticas hasta microservicios
date: 2016-09-12T8:10:20+02:00
description: "Un recorrido rápido sobre la evolución que otras empresas han hecho (y que tú también harás) hacia microservicios."
slug: desde-monoliticas-hasta-microservicios
draft: false
tags:
- arquitectura
- agilidad
- microservicios
- programación
temas:
- Arquitectura
niveles:
- Iniciaciación

disqus_identifier: desde-las-aplicaciones-monoliticas-hasta-los-microservicios
disqus_title: El Cloud es donde se ejecutan las aplicaciones
disqus_url: http://programar.cloud/posts/desde-monoliticas-hasta-microservicios
---

{{% img src="/media/almacen.jpg" alt="almacén lleno de stock" %}}


*TL;DR: Tenemos que ser conscientes de que seguimos pensando igual que hace unos años cuando las limitaciones tecnológicas son ahora otras.*

¿Cuánto tiempo llevas en el negocio? ¿Recuerdas cuando los servidores eran máquinas con dos procesadores y 128MB de RAM? Párate un momento a pensar sobre esto porque es importante: hace unos años era difícil conseguir máquinas e incluso las que utilizábamos en producción tenían menos potencia que el teléfono que llevas en tu bolsillo. Además el acceso a internet era limitado y las aplicaciones que desarrollábamos solían trabajar en red local y soportar un número pequeño de usuarios. Teníamos que **aprovechar al máximo el hierro disponible** y no podíamos arrancar más de una máquina virtual en un ordenador (no teníamos suficiente RAM). Por ello nació el concepto de *servidor de aplicaciones* que básicamente  permitía ejecutar de forma más o menos aislada varios componentes dentro de la misma *jvm*.<!--more-->

> La parte buena era que podías escaparte a la cafetería sin remordimientos.

Todo el ciclo de vida del software se basó en esta idea: aplicaciones que se lanzaban como librerías cargadas dinámicamente dentro de un proceso principal extra pesado. Y créeme, cuando digo pesado me refiero a que el *bootstrapping* podía llegar a durar decenas de minutos. La parte buena era que podías escaparte a la cafetería sin remordimientos.

Esto tiene consecuencias a todo lo largo del desarrollo del proyecto: todas las aplicaciones del servidor estaban obligadas a usar la misma pila (sistema operativo, versión de la jvm, versión del servidor de aplicaciones), se produción colisiones entre las versiones de las librerías que utilizaba cada aplicación, si una aplicación consumía muchos recursos afectaba al rendimiento de todas las demás, etc etc.

En este escenario una buena arquitectura de software incluía el concepto de separación en módulos y comunicación por interfaces y *value objects*. En teoría esto reducía el acoplamiento: si un módulo solo puede comunicarse con otro mediante objetos específicos en cualquier momento se podrían separar de forma limpia unos de otros. En la práctico esto suponía que o bien **los desarrolladores eran profundamente infelices** creando continuamente objetos cuyo único sentido en la vida era transportar datos entre capas o bien al final se terminaba haciendo uso de los mismos objetos en todos los módulos. Y claro, unos meses después resultaba imposible romper la aplicación en piezas más pequeñas porque básicamente el uso de un componente arrastraba indirectamente a todos los demás.Esto sucedía con casi todo, por ejemplo con la clase *Cliente*. Ah... la clase *Cliente*. No quieras ver lo que yo he visto, no quieras pelearte con una estructura que almacena más de cien atributos porque termina usándose en cualquier contexto posible del programa. Atributos que obviamente en su mayoría no entiendes porque ni tú ni nadie más controla todos los aspectos de **una aplicación que se ha creacido hasta convertirse en un monstruo**.

En otras palabras: terminamos haciendo exactamente lo contrario de lo que cualquier manual de buenas prácticas de los años 80 nos decía. Creamos programas gigantes y complejos, responsables de implementar todo tipo de funcionalidades que ni siquiera se encontraban relacionadas entre sí ¡y contra una única base de datos! 

Espera, he cogido carrerilla. Déjame que siga recordándote otras decisiones de arquitectura típicas: si la aplicación se ejecuta en una única máquina, vamos a guardar el estado de la sesión de usuario en la memoria de la misma. ¿Por qué no? Ok, que ahora hemos comprado otras dos máquinas más y queremos balancear entre ellas a los usuarios. No pasa nada, replicamos la sesión utilizando [multicast](todo). Claro que sí. ¿Te has preguntado por qué demonios [JBoss](todo) requería multicast para funcionar? Exacto. **En esta industria tenemos mucha tendencia a solucionar un problema con la opción más elegante por muy poco práctica que resulte**. Pero es que además utilizar multicast con un par de nodos puede funcionar pero cuando llegas a desplegar 100, 200 o 400 (como hace alguno de los clientes que tenemos en Capside) lo único que terminas consiguiendo es una denegación de servicio autoinflijida por el tráfico de red. Y eso si el proveedor te lo permite: AWS, por ejemplo, no acepta tráfico multicast en su red. Con buen criterio.

>¿Y qué velocidad puedes alcanzar cuando la prueba definitiva de que has hecho algo bien [...] se lleva a cabo una vez al mes en el mejor de los casos?

¿Y cómo afectaba esto al workflow de desarrollo y despliegue? Ya lo sabes: una nueva actualización de la aplicación suponía un desafío. Si tenías suerte y no había que tocar el esquema de la base de datos (que típicamente compartían todas las aplicaciones) solo tenías molestar a todas las máquinas del clúster. Por el cambio que fuese. ¿El color de un botón? Bien, redespliega 140MB de aplicación en cada nodo. ¿Un error tipográfico en un mensaje? Sí, sí: otro tanto. ¿Y qué velocidad puedes alcanzar cuando la prueba definitiva de que has hecho algo bien (el uso por parte del usuario final) se lleva a cabo una vez al mes en el mejor de los casos?

Échale un ojo a la foto que encuentras al principio del post, un clásico. ¿Qué es lo que ves ahí? Exacto, es dinero retenido. El guardar un producto en *stock* no deja de ser básicamente un desperdicio tanto para el consumidor como para el vendedor. El primero no puede disfrutarlo y el segundo ha pagado por él sin recibir nada a cambio. ¿Ves dónde quiero ir a parar? Eso es: **el código que no has pasado a producción es tu stock**.

Y no lo olvides, todo esto partió de una necesidad física, un condicionante tan importante como la ley de la gravedad: la falta de memoria y de hierro en general. El no disponer de infraestructura de forma ágil. Y como nos pasa con la existencia de la gravedad lo asumimos de forma tan natural que hasta hace poco parecía que no había otra manera de trabajar. Incluso cuando resultaron obvias las limitaciones que sufríamos seguimos utilizándolo durante mucho tiempo y todavía hoy en día los servidores de aplicaciones tradicionales suponen un porcentaje enorme del mercado. Sí, amigos y amigas, estamos rodeados de zombies y muchas veces se llaman Weblogic.

>Sí, amigos y amigas, estamos rodeados de zombies y muchas veces se llaman Weblogic.

Las cosas han cambiado radicalmente: no es que tengas recursos ilimitados (aunque según tu modelo financiero a veces el dinero no es un condicionante) pero lo que sí resulta imprescindible es ser capaz de recibir feedback rápidamente. Y no estoy hablando de una prueba para el cliente, estoy hablando de poner en funcionamiento el código escrito para que el usuario final determine si le ayuda a realizar su cometido o no, en un momento en el como te conté en el post anterior **levantar una flota de máquinas en el cloud resulta tan fácil como ejecutar una instrucción**.

> Vuelve a la esencia de Unix.

Así que aquí tienes unos principios básicos: vuelve a la esencia de Unix, vuelve a escribir pequeñas aplicaciones que sean capaces de llevar a cabo una función concreta. Y que lo hagan de forma tan independiente del resto como sea posible a todos los niveles. Utiliza la herramienta (plataforma) más adecuada en cada caso, guarda los datos en el repositorio que mejor se adapte a la estructura de los mismos, haz que la comunicación se base en *tuberías tontas* lo más sencillas posibles que cumplan un contrato. Y gracias a ello vas a tener menos complejidad, va a ser más fácil entender cada pequeño proyecto. Y estas piezas podrán tener su ciclo de vida independiente, testearse de manera independiente y desplegarse de forma independiente en su propia maldita infraestructura que se desarrollará junto a cada proyecto. No se trata de inventar nada, es solo volver a hacer las cosas bien ahora que la tecnología nos lo permite.

Dale el nombre que quieras a estas prácticas. Las puedes llamar *sentido común*, pero si quieres un nombre más *catchy* di que estás haciendo **microservicios**. Y por supuesto encontrarás problemas que antes no tenías pero te contaré cómo mantenerlos bajo control. Y créeme, esos problemas van a doler... pero no te van a paralizar como hacían los anteriores. Y vas a disfrutar mucho más.










