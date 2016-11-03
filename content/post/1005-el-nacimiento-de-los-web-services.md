---
title: El nacimiento de los web services
date: 2016-11-04T8:50:20+02:00
description: "Cómo el intercambio de documentos a través de HTTP se impuso como mecanismo de comuniación entre aplicaciones."
slug: el-nacimiento-de-los-web-services
draft: true
tags:
- cloud
- conceptos
- historia
temas:
- Conceptos
niveles:
- Iniciaciación

disqus_identifier: el-nacimiento-de-los-web-services
disqus_title: El nacimiento de los web services
disqus_url: //programar.cloud/posts/el-nacimiento-de-los-web-services
---

{{% img src="/media/cloud-money.jpg" alt="Dinero y poder en el cloud" %}}

*TL;DR: Hace 40 años que interconectamos aplicaciones pero el objetivo con el que lo hacíamos antes no tiene nada que ver con el que tenemos hoy en día.*

*Disclaimer: no me digas que este post es largo, que luego bien que coges la [jotdown](http://jotdown.es) y la lees de arriba abajo. Pero vamos, que vas a necesitar buscar un rato en el que nadie te agobie para poder dedicarle un cuartito de hora. Y recuerda: en estas primeras entradas estamos montando un framework mental. No hace falta que te quedes con todos los detalles pero sí que reflexiones sobre cómo hemos llegado hasta aquí.*

Hoy en *programar.cloud* tenemos una historia de poder, dinero, [bromance](https://es.wikipedia.org/wiki/Bromance), revoluciones tecnológicas y peleas a cara de perro entre egos. Y todo empieza con un adolescente llamado Marc que programaba con un Atari.<!--more-->

El amigo Marc siempre había tenido lo que ahora definiríamos como un espíritu emprendedor. Ya sabes, quería hacer cosas y quería ganar dinero con ellas. En los 80 (con 16 años) programaba [juegos](https://www.youtube.com/watch?v=d1obsZwaB04) para ordenadores de 8 bits. No es que fuesen los juegos más sofisticados de la década, pero hey, 16 años ¡y sin internet! En aquellos tiempos los ordenadores no se hablaban demasiado entre ellos y casi todas las aplicaciones se limitaban a guardar datos localmente o como mucho en el servidor de la oficina.

> En aquellos tiempos los ordenadores no se hablaban demasiado entre ellos.

Pasaron los años y al terminar los estudios Marc se metió en una gran empresa: Oracle. Mejor dicho, en una empresa *grande*. Allí fue dirigiéndose hacia posiciones más orientadas a negocio que a la parte técnica pero seguro que el chiquito seguía en contacto con los programadores que fabricaban los productos. **Con 23 o 24 años el amigo se convirtió en el vicepresidente más joven que había tenido la compañía**. Pasta gansa (entre trescientos mil y un millón de dólares de la época al año, según las fuentes) y una visión global de negocio que tendrá bastante que ver con lo que más adelante te cuento. Además se hizo íntimo amigo de Larry, el dueño de la compañía. Llegó a considerarlo su tutor.

### Las primeras aplicaciones web

Como todas las corporaciones de los 90 y por motivos que darían para otro post-culebrón en Oracle apostaron por Java. Habían comprado Orion (un servidor de aplicaciones sueco, aparentemente los suecos hacían estas cosas) y con esa facilidad característica suya para bautizar épicamente sus productos lo renombraron como "*OC4J*". Claro que sí. 

{{% img src="/media/java.svg" alt="Java Logo"%}}

En cualquier caso la idea detrás de este software era que los desarrolladores pudiesen crear aplicaciones web que fuesen capaces de escalar (crecer) según la carga de trabajo: si el hierro se quedaba corto en lugar de conseguir una máquina más grande lo que podías hacer es añadir más máquinas y crear una aplicación distribuída en un clúster. 

Umh... luego volvemos con Marc pero déjame que te aclare un poco la idea de aplicación distribuída porque quizá a ti esa época te pille muy lejos. Se trataba de unir los recursos de distintas máquinas de forma más o menos transparente para ejecutar lo que a nivel lógico (desde el punto de vista del programador) debería parecer un único programa. Es decir, puedes tener una variable ```miCarritoDeLaCompra``` en el ordenador *A* y el objeto apuntado por ella puede encontrarse físicamente en la máquina *B*. **Así puedes usar los recursos locales de *B* desde *A* y distribuir el trabajo entre ambas**. Espera, mejor con un dibujo:

{{% img src="/media/1005-el-nacimiento-de-los-web-services-diagrama.png" alt="diagrama con referencias entre máquinas" %}}

Obviamente entre dos máquinas no compartes ni RAM ni procesador por lo que debe de existir alguna magia intermedia para crear la ilusión de que ```miCarritoDeLaCompra.obtenerImporteTotal()``` se ejecute transparentemente y esta magia pasa por transmitir datos a través de la red. 

Este tipo de tecnología floreció en la segunda mitad de los 90 y de alguna manera prometían mejorar la arquitectura de aplicaciones síncronas (alguien pedía algo y se le contestaba inmediatamente) que solían utilizar variaciones de [RPC](https://en.wikipedia.org/wiki/Remote_procedure_call#History_and_origins) porque (de nuevo, en teoría) se adaptaban mejor a la orientación a objetos y casi no tendríamos que hacer cambios en el código para incorporarlas. **Si llevas un tiempo en el negocio te sonarán productos como [RMI](https://es.wikipedia.org/wiki/Java_Remote_Method_Invocation), [DCOM](https://es.wikipedia.org/wiki/Modelo_de_Objetos_de_Componentes_Distribuidos) o [CORBA](//c2.com/cgi/wiki?WhatsWrongWithCorba)**. En este último caso se trataba de magia negra de la peor calaña y motivo suficiente para pedir la cuenta y buscar otra empresa. En serio, no quieres usar CORBA. 

{{% img src="/media/batman-robin-corba.jpg" alt="batman enseña a robin a evitar corba" %}}

En cualquier en esta primera generación de aplicaciones web corporativas se utilizaba HTTP para presentar las pantallas HTML a los usuarios pero internamente los nodos que componían el clúster servidor se comunicaban entre ellos usando referencias remotas.

Si no te queda muy claro no te preocupes, **he montado un pequeño (screencast con una demo de RMI](TODO: enlace)**. No es que crea que vayas a utilizar mucho esta tecnología pero si te interesa Java necesitas conocerla por cultura general. Además sé que estás deseando coger el teclado y poder empezar a picar como si el mundo se terminase mañana así que cuando acabes de leer este post revisa el siguiente en el que incluyo el vídeo.

No parece tan malo ¿no? O sea... ¿qué problema tienen las aplicaciones distribuídas? Bueno, [Muchos](//queue.acm.org/detail.cfm?id=1142044). Además de las incompatibilidades que había entre algunas implementaciones de la misma tecnología (helloooo CORBA, estoy mirándote a ti) también te encontrabas conque el despliegue de este tipo era complicado: un nodo con una versión incorrecta del código o una regla en **un firewall cortando el tráfico y tu sistema empezaba a lanzar excepciones como si el mundo se terminase**. A nivel de diseño de alguna manera el modelo de programación favorecía (gracias a su potencia) el acoplamiento entre componentes... algo que a esta alturas ya tenemos claro que solo trae problemas ¿verdad?. ¿VERDAD? Con una cerveza te cuento historias para no dormir sobre este tema.

### La llegada del Service Oriented Architecture

En fin, en cualquier caso en algún momento los problemas de este enfoque se hicieron tan evidentes que las empresas que marcaban la innovación (porque amigos y amigas, antes la innovación en software la dirigían las grandes corporaciones) decidieron que había llegado la hora de crear una alternativa. Algo más modernito. Que no diese problemas con el maldito firewall. **Basado en eso que lo estaba petando, ya sabes, *la web***. 

{{% img src="/media/jodorowsky.jpg" alt="Un consejo ignorable de Alejandro Jodorowsky" %}}

La idea era separar completamente las máquinas entre sí: nada de conexiones permanentes entre clientes y servidores, nada comunicación directa entre los nodos servidores. Cada producto publicaría aquello que podía hacer a través de direcciones web y solo se comunicarían mediante peticiones HTTP para intercambiar documentos. 

Inicialmente este cambio añadía latencia a todo el procesamiento así que se modificó la granularidad con la que se manipalaban los datos: dejó de diseñarse alrededor de la invocación de rutinas (como se hacía en aplicaciones distribuídas) y se empezaron a intercambiar documentos completos. 

Siguiendo el ejemplo anterior,  ```obtenerImporteTotal()``` retornaba simplemente un número con el dinero que gastaría el cliente. En cambio una llamada a la operación ```ObtenerCarritoDeLaCompra``` del webservice correspondiente devolvería todos los datos del carrito (que probablemente ibas a necesitar igualmente) para reducir el número de veces que era necesario ejecutar la petición al servidor. 

Además un documento es independiente de la plataforma en la que se genera o se consume por lo que sistemas desarrollados en .net, java, cobol o *pon_aquí_tu_veneno_favorito* podrían integrarse mucho más fácilmente. En teoría.

> Los de *marketing* se pusieron a trabajar y hey, esta gente cumplió: acuñaron el término *web services*.

Los de *marketing* se pusieron a trabajar y hey, esta gente cumplió: acuñaron el término *web services*. Hasta la basura más grande podría venderse bien con un nombre tan bueno como ese y de hecho eso es exactamente lo que pasó. Porque como se hacía todo en esos momentos **en lugar de crear un producto y probar su viabilidad en batalla se decidió que había que montar un comité para escribir una especificación**. ¿Qué podía salir mal? Como siempre, todo el mundo intentó meter cucharada: IBM, Microsoft, Verisign... el resultado fue una sopa de siglas y tecnologías (SOAP, UDDI, WSDL y un sinfín de ws-*) realmente complejas cuyas implentaciones fueron desquiciantemente incompatibles durante años. Y XML. XML everywhere, maldita sea. 

> Hasta la basura más grande podría venderse bien con un nombre tan bueno como ese, y de hecho eso es exactamente lo que pasó.

Pero al menos esa primera generación de web services trajo algo muy bueno. Como he dicho antes **surgieron una serie de patrones de arquitectura que se basaban en interconectar aplicaciones independientes, no componentes de una única aplicación**. 

En aquella época se llamó a este patrón *Service Oriented Architecture* y con el tiempo demostró ser la forma más eficiente de abrir los sistemas de información al exterior. Habían nacido las *web APIs* tal y como las conocemos: un conjunto coherente de operaciones invocables mediante HTTP.

¡Pero volvamos a la historia de Marc! Está claro que aunque no se dedicase ya a programar nunca dejó de llevar un techie dentro y que estaba muy al tanto de cómo se organizaba la arquitectura de un software complejo. Quería montar su propio negocio y quería hacerlo como una empresa diseñada desde el principio para operar en internet, con lo que pidió pasta a un grupo de amigos (incluyendo al inefable [Larry](//www.expansion.com/economia-digital/protagonistas/2016/09/01/57c6f20be2704e34778b45b1.html), que aportó unos cuantos millones de su propio bolsillo) y arrancó su aventura. 

Estábamos en 1999, en plena *burbuja .com* y aunque supongo que sabes cómo terminó todo (o si quieres, un día te lo cuento) en retrospectiva está claro que algunas de las personas que se encontraban detrás de las empresas que protagonizaron esa bacanal tenían una visión muy clara de hacia dónde iba a evolucionar el mundo de la tecnología. De alguna manera eran pioneros en un territorio nuevo en el que el acceso a internet se había democratizado. Y sí, creo que Marc se encontraba entre ese grupo de personas.

{{% imgur jKf8DuX %}}

### El inicio del Software as a Service

A Marc no le gustaba el software que se utilizaba para gestionar el perfil de los clientes por parte de los comerciales, el llamado CRM. En esos años el movimiento Open Source no tenía la fuerza ideológica de hoy en día y muchas empresas **buscaban la fidelización del cliente básicamente atándolo** a su tecnología (Oracle sigue haciéndolo hoy en día, pero hey, esa es historia para otro momento). En cualquier caso debido a esta táctica de secuestro resultaba que integrar un *Customer Relationship Manager* con el workflow natural de la empresa era muy complicado cuando, si te lo paras a pensarlo, resulta que es una parte esencial del mismo: una acción comercial puede necesitar programar reuniones (en el calendario) que se celebrarán en salas (que deben de estar libres), enviar avisos al resto de miembros involucrados (usando correo o mensajería), requerir la aprobación de condiciones de venta (por parte del responsable correspondiente), etc, etc.

Nuestro protagonista decidió montar una alternativa basada en web que se pagase por suscripción. Solo esto ya fue una revolución y en cierto sentido **dio el impulso definitivo al primer tipo de cloud público que se popularizó**: el *Software as a Service* en el que te cobran por uso. Como modelo de negocio se había aplicado al correo electrónico y poco más pero ahora estábamos hablando de un producto de software clásico, una aplicación que englobaba mucho más que una funcionalidad concreta. 

Pero la *killer feature* de su producto fue la facilidad que aportaba para enlazarlo con cualquier otro sistema que tuviese la empresa: **a principios del año 2000 [anunciaron](//www.prnewswire.com/news-releases/salesforcecom-launches-at-demo-with-over-150-customers-72423997.html) la publicación de su Application Program Interface, es decir, la lista y especificación de los web services soportados**. Mediante ellos cualquier programa que fuese capaz de invocar HTTP podía interactuar con este sistema intercambiando datos y ejecutando acciones sin tener que instalar nada en el código del CRM. 

Rápidamente surgió un ecosistema de funcionalidades creadas por terceros que enriqueció las que la criatura de Marc implementaba. El resto es eso, historia: se me había olvidado comentarte que el nombre de la empresa es *Salesforce* y que hoy en día tiene un valor de 49.000 millones de euros. No los pillo todos los días. Aquí tienes una foto reciente del bueno de Marc sacada de la Wikipedia:

{{% img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Marc_R._Benioff_World_Economic_Forum_2013.jpg/800px-Marc_R._Benioff_World_Economic_Forum_2013.jpg" alt="Marc Benioff" %}}

Muy poco tiempo después le siguieron eBay, Amazon, Yahoo, Google, Facebook, Flickr, Twitter y otras empresas. En pocos años internet se convirtió en territorio API y nunca dejes de visitar de vez en cuando [programmableweb.com](//programmableweb.com) para maravillarte con perlas como la que te permite conocer mejor a [Chuck Norris](//www.programmableweb.com/api/chuck-norris-facts) o (si tu estómago lo admite) [pedir una pizza](//www.programmableweb.com/mashup/dom-dominos-pizza) en Domino's. Tampoco están tan malas. Si hace días que no comes.

Así que de alguna manera Salesforce ha impulsado tanto como Google con Gmail o Amazon con AWS la tecnología cloud aunque por el camino Marc y Larry tuvieron algunos problemillas con su amistad. Nada que no se pueda solucionar comprando otro coche o pasando una semana en el yate, pero bueno, tuvimos algunos episodios divertidos cuando Marc se enteró de que Larry estaba creando su propio CRM en Oracle y lo echó del consejo directivo de Salesforce o cuando [Larry canceló la keynote](//www.buscocrm.com/benioff-dissed.php) con la que Marc iba a abrir el congreso mundial de Oracle horas antes de la inauguración. Marc terminó pronunciando igualmente su discurso, aunque lo hizo en una cervecería cercana al evento. En serio. Qué tíos. Os dejo una foto reciente de Larry en su ducentésimo décimo cuarto cumpleaños:

{{% img src="https://c1.staticflickr.com/5/4149/5007504146_5e61a2e79d_b.jpg" alt="Larry Ellison" %}}

### Conclusiones

En cualquier caso hoy en día **cualquier producto que se desarrolle tiene que tener en su base un API basada en web services HTTP de manera que sea fácil automatizarlo, que sea fácil integrarlo en otros sistemas**. Y la arquitectura de los sistemas modernos tiende a basarse en pequeños programas independientes con lo que un API ya no solo es el mecanismo universal para publicar el sistema de cara al exterior: también es la forma en que se encadenan las piezas de un producto para realizar una labor compleja.

Y no te desesperes: en general cuando hablamos de web services hoy en día no nos referimos a ese infierno llamado SOAP que comentábamos antes. Casi siempre te encontrarás con APIs basadas en [REST](https://es.wikipedia.org/wiki/Representational_State_Transfer) de las que hablaremos (en profundidad) más adelante.

¿Y qué fue del bueno de Marc? Si quieres saber más sobre su vida puedes consultar la entrada en la [Wikipedia](https://en.wikipedia.org/wiki/Marc_Benioff) que ha escrito su mami (o al menos eso parece). De hecho, fue su madre quien aparentemente le convenció de que no estaba bien seguir enfadado con su viejo amigo y finalmente recompuso su relación Larry "the devil" Ellison. Hoy en día siguen jugando juntos al golf.

### Ideas clave

Resumen de lo que quiero que te lleves de este post:

- Posiblemente puedas comercializar tu producto como SaaS
- Basa tu arquitectura en pequeñas aplicaciones independientes
- Haz que se comuniquen mediante web services REST
- Facilita la integración con terceros que añadan valor a tu oferta
- Nada de XML, nada de SOAP, nada de sobreingeniería, hazlo fácil, joga bonito
- Si Marc y Larry parecen tristes, no te preocupes: siempre les quedará el yate

¿Cómo, otro vídeo más? Sí: con esté tendrás más clara la clasificación de clouds. Qué significa un IaaS, un PaaS y un SaaS (con algún detalle no totalmente obvio), qué es un cloud público, privado e híbrido y cuáles son las ofertas más relevantes actualmente. Enjoy. **Y dale al me gusta, y comparte en twitter, que es gratis**.

[TODO youtube]

jv


pd: La imagen inicial del post de hoy la ceden los chiquitos de [401kcalculator.org](//401kcalculator.org). La foto del bueno de Larry la publica Oracle en [Flickr](https://www.flickr.com/photos/oracle_images/5007504146). La de Marc ha salido de la [Wikipedia](https://commons.wikimedia.org/wiki/File:Marc_R._Benioff_World_Economic_Forum_2013.jpg#file). Y la música que sirve de cortinilla del vídeo es de [Marcus](https://soundcloud.com/musicbymarcus/promo-music-inspiational), como siempre.

ppd: Aquí un [artículo](http://sdtimes.com/sd-times-blog-marc-benioff-vs-larry-ellison-who-throws-the-better-party/3/) que compara los eventos organizados por Salesforce con los de Oracle. Al César lo que es del César, parece que Oracle hace las mejores fiestas.

pppd: Por si no has tenido suficente dosis de chafardeo, [este artículo resume los mejores momentos de la relación entre Larry y Marc](http://www.businessinsider.com/larry-ellison-marc-benioff-relationship-2015-8). Para darle más morbo, está publicado en un medio propiedad de Jeff Bezos, el dueño de Amazon.

pppd: En este enlace puedes ver [la infografía sobre la crisis .com](https://www.flickr.com/photos/gdsdigital/4443630014/in/photostream/). Desgraciadamente la fuente original parece no estar en línea.

