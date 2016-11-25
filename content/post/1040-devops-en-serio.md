---
title: "Devops. No, en serio: Devops."
date: 2016-11-18T8:50:20+02:00
description: "Cambios organizativos que tienen mucho más que ver con las personas que con la tecnología."
slug: devops-en-serio
draft: true
tags:
- agilidad
- casos
temas:
- Arquitectura
niveles:
- Iniciaciación

disqus_identifier: devops-en-serio
disqus_title: Microservicios en el mundo real
disqus_url: //programar.cloud/post/devops-en-serio
---

{{% img src="/media/velocidad.jpg" alt="Velocidad" %}}

*TL:DR; A ver si lo entendemos de una vez: la herramientas son un medio, no el fin. Devops es más una cultura que un Jenkins generando artefactos sin testearlos.*

Si me diesen un euro por cada vez que escucho en un cliente lo de "somos devops: mira, tenemos un Jenkins" me podría retirar a Menorca mañana mismo. Casi. Diez o doce euros los tendría seguro. El problema es el mismo de siempre: necesitas un nombre para vender (evangelizar) una idea. Algo que aglutine todo lo que quieres transmitir en una única palabra. Y esa palabra tiene que ser lo más potente posible. A veces resulta tan potente que termina canibalizando la idea y al final solo queda eso, la palabra, vacía y sin contenido.

Para que te quede más claro voy a contarte algo bastante personal: los detalles de la que fue mi peor experiencia profesional, con diferencia.<!--more-->

Fíjate en los artículos que vas leyendo por aquí: todavía no hemos visto código. Casi todos giran alrededor del concepto de agilidad, de reducir fricciones para que el tiempo que pasa desde que se decide realizar una acción hasta que se ha puesto en marcha sea el mínimo posible. Y esto implica un montón de cambios respecto a la forma en la que tradicionalmente trabajábamos: equipos pequeños, autogestionados, multidisciplinares, con objetivos claros a muy corto plazo, capaces de desarrollar y pasar a producción código en el **mínimo tiempo posible pero asegurando la calidad**. Y si te fijas solo en el último punto las herramientas tienen un peso grande.

Repasa el párrafo anterior, es más denso de lo que parece. Está claro que si quieres acelerar la entrega vas a necesitar quitarte problemas del medio: ya hablaremos de arquitecturas inmutables, de automatización de infraestructura, de facilitación del despliegue, de orientación a microservicios, etc. Y de frameworks, integración y entrega continua, patrones de diseño y cien cosas más. Pero al final el bloqueador más importante que hay son las personas. Te cuento un ejemplo que le pasó a un amigo. Bueno, no: me pasó a mi.

Trabajé un tiempo en una empresa que se dedica a gestionar el seguro médico de varios millones de trabajadores en España... los once meses más frustrantes de toda mi vida profesional. Con una cerveza te explio los detalles más escabrosos pero lo más relevante ahora es que te cuente algunas anécdotas sobre el workflow de trabajo que teníamos. No me invento nada, palabrita.

Éramos unas ocho personas desarrollando. La primera división era contractual: si formabas parte de la plantilla tenías ciertos derecho. Si (como yo) eras externo, no tanto. En nuestro caso eso no suposo ningún roce pero psicológicamente es una primera barrera, una división. 

Los requerimientos del cliente los tomaba una persona de organización que a su vez contactaba con la jefa de proyecto que a continuación nos lo explicaba a algunos de nosotros que terminábamos transmitiéndolos al resto. Imagínate el juego del teléfono que montamos. Imagínate lo que suponía pedir una aclaración.

Las primeras semanas las dedicamos a realizar análisis y diseño. Sin picar una sola línea de código. Sin desplegar nada. Sin enseñar ningún resultado a nadie. Sin **feedback**, maldita sea. Esta fue la tónica general, una sobredocumentación totalmente ridícula (solo yo llegué a generar 400 páginas de texto y esquemas) que obviamente nadie entendía ni actualizaba. Y una falta de entregables que impedía corregir ninguna decisión.

La mitad del equipo no teníamos ni idea sobre cómo funcionaba un 390 de IBM, donde correría una pequeña parte del código. La otra mitad no tenía ni idea de cómo funcionaba un PC. En ningún momento se realizó ningún tipo de taller interno para tratar de establecer un idioma común. No hablo de convertirnos a todos en expertos en aplicaciones web o magos de los ficheros indexados: me refiero solo a tener unas nociones básicas de cómo funcionaba el conjunto de la infraestructura que utilizaríamos.

El director del departamento compartía responsabilidades con la directora de proyecto en la gestión del mismo. No estaba en el día a día pero su peso político era obviamente mayor. Su background era de COBOL para 390 de los años 80 así que pensó que sería buena idea mantener las convenciones que él usaba en la parte de PC. Con lo que terminamos programando con identificadores que no podían sobrepasar los tres caracteres de longitud más un número. Por ejemplo, si acumulabas algo podías llamar a la variable ```tot1```. Si se utilizaba dentro de una rutina para calcular (digamos) la media esta rutina podría llamarse ```cma1```. De *calcular media aritmética*. Por qué no. Obviamente al cabo de unas horas ya no sabías qué demonios habías escrito. Era peor que descifrar una expresión regular de media página. Espera, no he terminado.

Buena parte del equipo tampoco sabía utilizar un sistema de control de versiones. Tras unas cuantas guerras de *commits* decidieron que se bloquearían los ficheros que se editasen de forma exclusiva. Imagínate: una persona se convertía durante el tiempo que le pareciese conveniente en el dueño de ese archivo. Al final todo el mundo tratábamos de añadir todo el código posible al mismo fichero porque era el que en ese momento podías editar. Y a veces trampeabas el sistema de bloqueos para poder probar algo cambiando un fichero que se supone no deberías poder modificar en ese momento y que obviamente se sobreescribía por parte de otra persona más adelante. Sobreescribía, no mezclaba.

Y claro, ni un test. 0. Nothing. Nada. De verdad. Pero es que durante unos cuántos días ni siquiera se podía compilar el código porque hacía falta una dependencia de terceros que todavía no estaba lista. Creo recordar que porque no habían pagado la licencia. El comentario por parte de la dirección del proyecto fue "no pasa nada, si el análisis es correcto no tiene por qué no funcionar".  Ocho personas. Desarrollando durante días. Sin compilar siquiera.

Una pequeña parte del proyecto era una aplicación web, no me hagas decirte exactamente para qué servía. Las personas que la desarrollaban tenían un Apache instalado en una máquina cuyo sistema de ficheros era una carpeta compartida por NFS. Editaban desde su puesto esos ficheros compartidos y recargaban el navegador para ver los cambios, que obviamente afectaban al resto del equipo. Y no te digo nada si alguien decidía cambiar la configuración del servidor. 

¿Y el equipo de sistemas? Ni idea. Como durante el tiempo que estuve en el proyecto no hicimos ni un pase a producción (ni uno, tras diez meses) no llegaron a intervenir. Eso signfica que tampoco tuvieron voz ni voto en la arquitectura del producto que en principio ellos deberían cuidar una vez se desplegase. Si desde nuestra visión parcial de la empresa que teníamos como developers hubiésemos tomado una decisión equivocada importante al principio podría haberse dado el caso de que eso hubiese hecho fracasar completamente el proyecto. Pequeños detalles como por ejemplo que los usuarios del mismo no tuviesen permisos para instalar la aplicación. O que en algunas sucursales no existiese una buena conectividad y que por lo tanto poder trabajar offline fuese imprescindible. Por poner algo. Como pasó finalmente, por supuesto.

Pensarás que lo que te he contado es lo peor que sucedía pero en realidad lo peor fueron las dinámicas de grupo que se generaron. Esas que te explico solo con un mojito delante (invito yo). 

Bueno, creo que te he puesto en situación. Ahora haz un repaso de los puntos anteriores. E interioriza de una vez que agilidad y devops no es algo que se centre en las herramientas y en el software. Que tienen mucho más que ver con los procesos, con la cultura y en el fondo con las personas. 

En ocasiones es muy complicado cambiar el ambiente que se ha creado, deshacer las parcelas de poder y convencer a las personas implicadas que todos ganarán si se trabaja de una manera más flexible. Y hay que saber qué batallas puedes ganar y por lo tanto merecen la pena luchar en ellas. Si tu empresa es del estilo que te he contado (y conozco unas cuantas bastante equiparables) y tú no eres Batman (o Shatia Natella) no te enfrentes a esa cultura directamente. Consigue una esponsorización potente, consigue implicar a alguien que tenga poder ejecutivo real para tomar decisiones drásticas si es necesario. Empieza introduciendo metodologías ágiles en los equipos que estén más predispuestos. Remarca los problemas que tienen con el workflow actual y 

Y  no me vuelvas a decir que tienes un Jenkins si solo lo usas para generar los ficheros *war*. 

jv













