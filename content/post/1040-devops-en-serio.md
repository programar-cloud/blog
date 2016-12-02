---
title: "Devops. No, en serio: Devops."
date: 2016-12-02T8:50:20+02:00
description: "Cambios organizativos que tienen mucho más que ver con las personas que con la tecnología."
slug: devops-en-serio
draft: false
tags:
- agilidad
- casos
temas:
- Conceptos
niveles:
- Iniciaciación


episode : "10"
audio : "https://ia601505.us.archive.org/12/items/devops-en-serio-devops/audio-post.mp3"
media_bytes : "14561919"
media_duration : "17:36"
images : ["https://programar.cloud/media/stormtroopers.jpg"]
explicit : "no"



disqus_identifier: devops-en-serio
disqus_title: "Devops. No, en serio. Devops."
disqus_url: https://programar.cloud/post/devops-en-serio
---

{{% img src="/media/stormtroopers.jpg" alt="stormtroopers" %}}

*TL:DR; A ver si lo entendemos de una vez: la herramientas son un medio, no el fin. Devops es más una cultura que un Jenkins generando artefactos sin testearlos.*

{{% archive "devops-en-serio-devops" %}}

Si me diesen un euro por cada vez que escucho lo de "hacemos devops: mira, tenemos un Jenkins" me podría retirar a Menorca mañana mismo. Casi. Diez o doce euros los tendría seguro y esa otra frase de "no, si no necesitamos gente de sistemas, somos devops". Es señal inequívoca de que la arquitectura y el mantenimiento de la infraestructura es un drama.

El problema es el mismo de siempre: necesitas un nombre para vender (evangelizar) una idea. Algo que aglutine todo lo que quieres transmitir en una única palabra. Y esa palabra tiene que ser lo más potente posible. A veces resulta tan potente que termina canibalizando la idea en sí por muy buena que esta sea y al final solo queda eso, la palabra, vacía y sin contenido: todo el mundo quiere apropiarse de ella y nadie sabe exactamente lo que significa.

Para que te quede más claro voy a contarte algo bastante personal: los detalles de la que fue mi peor experiencia a nivel profesional con diferencia.<!--more-->

> Porque este objetivo implica un montón de cambios respecto a la forma en la que tradicionalmente trabajábamos.

Fíjate en los artículos que vas leyendo por aquí: todavía no hemos visto código (calma, falta poco). Casi todos giran alrededor del concepto de agilidad, de reducir fricciones para que **el tiempo que pasa desde que se decide realizar una acción hasta que se pone en marcha sea el mínimo posible**. Devops es una de las estrategias que puedes usar para llegar a ese objetivo y en el cuento de hoy verás que casi todo gira alrededor de la cultura, no del software. Porque este objetivo implica un montón de cambios respecto a la forma en la que tradicionalmente trabajábamos: equipos pequeños, autogestionados, multidisciplinares, con metas claras a muy corto plazo, capaces de desarrollar y pasar a producción código en el **mínimo tiempo posible pero asegurando la calidad**. Y si te fijas solo en el último punto las herramientas tienen un peso grande.

Repasa el párrafo anterior, es más denso de lo que parece. 

Está claro que si quieres acelerar la entrega vas a necesitar quitarte problemas de en medio con arquitecturas inmutables, automatización de infraestructura, facilitación del despliegue, {{% ilink "que-son-los-microservicios" "orientación a microservicios" %}}, etc. Y mediante frameworks, integración y entrega continua, patrones de diseño y cien cosas más. Pero al final el bloqueador más importante que hay son las personas. 

De eso va exactamente devops: de evitar que haya un muro entre desarrollo y operaciones tanto a nivel de procesos como a nivel humano. Te cuento un ejemplo que le pasó a un amigo. Bueno, no: me pasó a mi, ya te lo he dicho antes.

{{% img src="/media/devops-toolchain.svg" alt="devops toolchain" %}}

Trabajé un tiempo en una empresa que se dedica a gestionar el seguro médico de varios millones de trabajadores en España... los once meses más frustrantes de toda mi vida profesional. Con una cerveza te explio los detalles más escabrosos pero lo relevante ahora es que te cuente algunas anécdotas sobre el workflow de trabajo que teníamos. No me invento nada, palabrita.

Éramos unas ocho personas desarrollando y la primera división era contractual: si formabas parte de la plantilla tenías ciertos derecho. Si (como yo) eras externo, no tantos. Pequeñas cosas, en realidad, y en nuestro caso eso no suposo ningún roce. Pero psicológicamente es una primera barrera, una división. 

> Imagínate el juego del teléfono que montamos. Imagínate lo que suponía pedir una aclaración.

Para esta aplicación los requerimientos del cliente los tomaba una persona de organización que a su vez contactaba con la jefa de proyecto que a continuación nos lo explicaba a algunos de nosotros que terminábamos transmitiéndolos al resto. Imagínate el juego del teléfono que montábamos. Imagínate lo que suponía pedir una aclaración. Y lo descolgados que quedaban los usuarios finales y por lo tanto el **nulo grado de implicación por su parte que tuvimos**.

Las primeras semanas las dedicamos a realizar análisis y diseño. Sin picar una sola línea de código. Sin desplegar nada. Sin enseñar ningún resultado a nadie. Sin **feedback**, maldita sea. Esta fue la tónica general, una sobredocumentación totalmente ridícula (solo en mi caso llegué a generar 400 páginas de texto y esquemas) que obviamente nadie entendía ni actualizaba. Y una falta de entregables que impedía corregir ninguna decisión equivocada. Y lo que te cuento siempre: la única manera de saber que lo estás haciendo bien es poner a funcionar tu sistema y ver cómo los usuarios interaccionan con él.

Además, la mitad del equipo no teníamos ni idea sobre cómo funcionaba el 390 de IBM donde correría una pequeña parte del código y donde se guardarían buena parte de los datos. La otra mitad no tenía ni idea de cómo funcionaba un PC. **En ningún momento se realizó ningún tipo de taller interno para tratar de establecer un idioma común y compartir conocimiento**. No hablo de convertirnos a todos en expertos en aplicaciones web o magos de los ficheros indexados: me refiero solo a tener unas nociones básicas de cómo funcionaba el conjunto de la infraestructura que utilizaríamos.

{{% imgur eOujtMN "Turno de tarde de sistemas." %}}

El director del departamento compartía responsabilidades con la directora de proyecto en la gestión del mismo. No estaba en el día a día pero su peso político era obviamente mayor. Tenía background era de COBOL para 390 de los años 80 así que pensó que sería buena idea mantener las convenciones que él usaba en la parte de PC. Con lo que terminamos programando con identificadores que no podían sobrepasar los tres caracteres de longitud más un número. 

Por ejemplo, si acumulabas algo podías llamar a la variable ```acu1```. Si se utilizaba dentro de una rutina para calcular (digamos) la media esta rutina podría llamarse ```cma1```. De *calcular media aritmética*. Por qué no. Obviamente al cabo de unas horas ya no sabías qué demonios habías escrito. Era peor que descifrar una expresión regular de media página. **Y era una decisión impuesta desde fuera del equipo que obviamente no tenía ningún sentido**. Espera, no he terminado.

> Tras unas cuantas guerras de *commits* decidieron que se bloquearían los ficheros que se editasen de forma exclusiva.

Buena parte del equipo tampoco sabía utilizar un sistema de control de versiones. Tras unas cuantas guerras de *commits* decidieron que se bloquearían los ficheros que se editasen de forma exclusiva. Imagínate: una persona se convertía durante el tiempo que le pareciese conveniente en el dueño de ese archivo. Al final todo el mundo tratábamos de añadir todo el código posible al mismo fichero porque era el que en ese momento podías editar. Y a veces trampeabas el sistema de bloqueos para poder probar algo cambiando un archivo que se supone no deberías poder modificar en ese momento. Obviamente ese archivo era sobreescrito por otra persona casi siempre. Sobreescrito, no mezclado. **Resultaba imposible desarrollar una característica sin afectar al resto del equipo** y no había manera de consultar los cambios hechos en el código.

Y claro, ni un test. 0. Nothing. Nada. De verdad. Pero es que durante unos cuántos días ni siquiera se podía compilar el código porque hacía falta una dependencia de terceros que todavía no estaba lista. Creo recordar que porque no habían pagado la licencia. El comentario por parte de la dirección del proyecto fue "no pasa nada, si el análisis es correcto no tiene por qué no funcionar".  Ocho personas. Desarrollando durante días. Sin compilar siquiera. **Acumulando errores en lugar de detectarlos y atajarlos tan rápido como fuese posible**. Eso es lo que te permite conseguir un pipeline de integración contínua: más que evitar errores lo que hace es detectarlos rápidamente para que sus efectos no se expandan.

{{% imgur "q1fmOkn" "Hermanos Marx" %}}

Una pequeña parte del proyecto era una aplicación web, no me hagas decirte exactamente para qué servía. Las personas que la desarrollaban tenían un Apache instalado en una máquina cuyo sistema de ficheros era una carpeta compartida por NFS. Editaban desde su puesto esos ficheros compartidos y recargaban el navegador para ver los cambios, que obviamente afectaban también al resto del equipo. Y no te digo nada si alguien decidía cambiar la configuración del servidor. Es decir, **nadie disponía de un auténtico entorno de desarrollo individual** con lo que de nuevo nos molestábamos todo el tiempo.

> Pequeños detalles como por ejemplo que los usuarios del mismo no tuviesen permisos para instalar la aplicación.

¿Y el equipo de sistemas? Ni idea. Y esto sí es totalmente dramático: como durante el tiempo que estuve en el proyecto no hicimos ni un pase a producción (ni uno, tras diez meses) no llegaron a intervenir. **Eso signfica que tampoco tuvieron voz ni voto en la arquitectura del producto que en principio ellos deberían cuidar una vez se desplegase**. Si desde nuestra visión parcial de la empresa y de la tecnología que teníamos como developers hubiésemos tomado una decisión equivocada importante al principio podría haberse dado el caso de que eso hubiese hecho fracasar completamente el proyecto. Pequeños detalles como por ejemplo que los usuarios del mismo no tuviesen permisos para instalar la aplicación. O que en algunas sucursales no existiese una buena conectividad y que por lo tanto poder trabajar offline fuese imprescindible. Por poner algo. Como pasó finalmente, por supuesto.

La gente de sistemas tenía sus propias taritas. Algunos de ellos llevaban más de diez años enterrados en su propia trinchera viviendo un claro caso de paranoia. Pero seguro que si desde el principio hubiesen tenido más peso en el diseño del software nos habrían dicho que **es totalmente crítico disponer de métricas** para después poder monitorizar la aplicación. Esas métricas y heartbeats que no implementamos. Ya no te digo nada de definir objetivos de rendimiento, [KPIs de negocio](http://www.nicolasmarchal.com/marketing/kpis-que-es-como-ayudan-y-ejemplos/), etc. Porque lo que no puedes medir no puedes corregir. Y no puedes automatizar ninguna reacción a errores, vas a estar siempre pendiente de recibir una llamada diciéndote que el sistema ha vuelto a caer.

{{% imgur u5JKSbT "¿Qué me decías sobre ese hotfix?" %}}

Obviamente tampoco se llegó a discutir realmente qué táctica iba a utilizarse para realizar despliegues. Y diría que **a nadie se le pasó por la cabeza la posibilidad siquiera de automatizar esta parte crítica del ciclo de vida**, ni de qué haríamos en caso de que un rollback a una versión anterior fuese necesario. Bueno, con el diseño que teníamos probablemente ni siquiera habría sido posible.

Pensarás que lo que te he contado es lo peor que sucedía pero en realidad **lo peor fueron las dinámicas de grupo que se generaron**. Esas te las explico solo con un mojito delante (invito yo). 

Bueno, creo que te he puesto en situación. Ahora haz un repaso de los puntos anteriores: te los he marcado en negrita para que no tengas que volver a leerlo todo. Interioriza de una vez que agilidad y devops no es algo que se centre solo en las herramientas y en el software. Que tienen mucho más que ver con los procesos, con la cultura. Y en el fondo, con las personas. 

> Interioriza de una vez que agilidad y devops no es algo que se centre solo en las herramientas y en el software.

Y ya lo sé, en ocasiones es muy complicado modificar el ambiente que se ha creado, deshacer las parcelas de poder y convencer a las personas implicadas que todos mejorarán su calidad de vida si se trabaja de una manera más flexible. Hay silos que no se rompen en dos días y **tienes que saber qué batallas puedes ganar y por lo tanto merecen la pena luchar en ellas**. 

Si tu empresa es del estilo que te he contado (y conozco unas cuantas bastante equiparables) y tú no eres Batman (o Satya Nadella) no te enfrentes a esa cultura frontalmente. Consigue una esponsorización potente, consigue implicar a alguien que tenga poder ejecutivo real para tomar decisiones drásticas en el caso de que no haya ninguna otra solución. Empieza introduciendo metodologías ágiles en los equipos que estén más predispuestos. Remarca los problemas que tienen con el workflow actual y el nivel de hipercompetividad al que nos estamos dirigiendo aceleradamente. Busca un rol útil para la gente que siendo válida no se adapte a esta evolución. Crea mecanismos de transparencia para que todo el mundo sea consciente del estado general los proyectos. Y marca objetivos razonables, no imposibles.

{{% imgur sDkxb2x "Técnico de soporte atendiendo un nuevo ticket" %}}

Pero es que este cambio no es opcional, ni tenemos mucho tiempo para llevarlo a cabo. ¿Sabes a qué me refiero cuando hablo de hipercompetividad? Mucha gente cree que cuando digo que el mundo cada vez se parece más al presentado por [Demolition Man](http://www.imdb.com/title/tt0106697/) estoy bromeando. Y no es así: ¿recuerdas que en la película solo Pizza Hut había sobrevivido a *la guerra de las franquicias*? ¿Y que por lo tanto todos los restaurantes eran Pizza Hut? Bueno, el pasado Black Friday algunas estimaciones afirman que [Amazon.com suposo el 37% del total de las ventas online en USA](https://www.internetretailer.com/2016/11/29/amazon-accounts-nearly-40-holiday-weekend-web-sales). El 37%. ¿Crees que la tendencia se va a invertir en los próximos años? A mi me cuesta poco imaginar un futuro en el que una sola tienda controle el 80% del negocio, una sola empresa gestione todos los taxis del planeta y un solo servicio venda la enorme mayoría de las habitaciones para turistas. Por muchos motivos no es la clase de sociedad en la que me gustaría vivir. Hazles ver a la capa de negocio de tu empresa  que tampoco a ellos les conviene y que solo vamos a poder evitarlo innovando rápido. Que no se trata de trabajar más, se trata de aportar el máximo valor durante el tiempo que lo estamos haciendo y eso solo podemos conseguir si disfrutamos con ello.

Que al fin y al cabo es por lo que nos apuntamos a esta profesión.


jv

pd: en el *fe de ratas* de hoy perdonad por decir PKI en lugar de KPI en el audio. No os cortéis cuando la dislexia se apodere de mi y comentadlo en el blog.

ppd: la imagen del post es una instantánea del momento en el que un developer pide a un sysadmin una subida a producción un viernes por la tarde. Siento mucho no haber podido encontrar al autor de la misma. La música que sirve de cortinilla es de [Marcus](https://soundcloud.com/musicbymarcus/promo-music-inspiational) y ya sabes que siempre me hace sonreír.

pppd: sí, sí, ya he caído en el tópico y te he puesto un clipart con un diagrama. Pero es bastante bueno y ha salido de [la entrada sobre devops toolchain de la wikipedia](https://en.wikipedia.org/wiki/DevOps_toolchain). También he recuperado una foto de dos compañeros en el turno de tarde en la empresa de la que hemos hablado y de mi ex-jefa recibiendo por teléfono una actualización de los requerimientos.

ppppd: la penúltima imagen muestra la expresión de un compi la primera vez que se subió algo a producción. Me la han pasado, yo ya no estaba allí. Bueno, no, es de [IT Crowd](https://es.wikipedia.org/wiki/The_IT_Crowd) que aunque no es mi veneno tiene una legión de seguidores.

pppppd: y por supuesto, al final de todo, tienes una foto de uno de los chicos de soporte recogiendo un nuevo ticket. De verdad, no dejes de ver [Demolition Man](https://es.wikipedia.org/wiki/Demolition_Man), la película distópica que mejor describe el futuro en el que ya estamos.

ppppppd: y acuérdate de compartir esto en tus redes sociales, que mientras más seamos mejor lo vamos a pasar todos :)













