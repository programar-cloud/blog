---
title: El nacimiento de los web services
date: 2016-10-23T8:50:20+02:00
description: "Cómo el intercambio de documentos a través de HTTP se impuso como mecanismo de comuniación entre aplicaciones."
slug: el-nacimiento-de-los-web-services
draft: true
tags:
- arquitectura
- historia
temas:
- Arquitectura
niveles:
- Iniciaciación

disqus_identifier: el-nacimiento-de-los-web-services
disqus_title: El nacimiento de los web services
disqus_url: //programar.cloud/posts/el-nacimiento-de-los-web-services
---

{{% img src="/media/cloud-money.jpg" alt="Dinero y poder en el cloud" %}}

*TL:DR; Hace 40 años que interconectamos aplicaciones pero el objetivo con el que lo hacíamos antes no tiene nada que ver con el que tenemos hoy en día.*

Hoy en *programar.cloud* tenemos una historia de poder y dinero, *bromance*, revoluciones tecnológicas y peleas a cara de perro por el mercado. Y todo empieza con un adolescente llamado Marc con un Atari.<!--more-->

El amigo Marc siempre había tenido lo que ahora definiríamos como un espíritu emprendedor. Ya sabes, quería hacer cosas y quería ganar dinero con ellas. En los 80, con 16 años, programaba [juegos](https://www.youtube.com/watch?v=d1obsZwaB04) para ordenadores de 8 bits. No es que fuesen los juegos más sofisticados de la década, pero hey, 16 años ¡y sin internet! En aquellos tiempos los ordenadores no se hablaban demasiado entre ellos y casi todas las aplicaciones se limitaban a guardar datos localmente o como mucho en el servidor de la oficina.

> En aquellos tiempos los ordenadores no se hablaban demasiado entre ellos.

Pasaron los años y Marc se metió en una gran empresa: Oracle. Mejor dicho, en una empresa *grande*. Allí fue dirigiéndose hacia posiciones más orientadas a negocio que a la parte técnica pero seguro que el chiquito seguía en contacto con los programadores que fabricaban los productos. **Con 23 o 24 años el amigo se convirtió en el vicepresidente más joven que había tenido la compañía**. Pasta gansa (un millón de dólares al año) y una visión global de negocio que tendrá bastante que ver con lo que más adelante te cuento. Además se hizo íntimo amigo de Larry, el dueño de la compañía. 

Como todas las corporaciones de los 90 en Oracle apostaron por Java. Habían comprado Orion (un servidor de aplicaciones sueco) y con esa facilidad característica suya para bautizar épicamente sus productos lo renombraron  *OC4j*. Claro que sí. La idea detrás de este software era que los desarrolladores pudiesen crear aplicaciones web que fuesen capaces de escalar (crecer) según la carga de trabajo: si el hierro se quedaba corto, añadías más máquinas y creabas una aplicación distribuída. 

Umh... luego volvemos con Marc pero déjame que te aclare un poco la idea de aplicación distribuída porque quizá a ti esa época te pille muy lejos. Se trataba de unir los recursos de distintas máquinas de forma más o menos transparente para ejecutar lo que a nivel lógico (desde el punto de vista del programador) debería parecerte un único programa. Es decir, puedes tener una variable ```miCarritoDeLaCompra``` en el ordenador *A* y que el objeto apuntado por ella se encuentre físicamente en la máquina *B*. **Así puedes utilizar los recursos locales de *B* desde *A* o bien sumar la CPU y memoria de ambas**.

Obviamente entre dos máquinas no compartes ni RAM ni procesador así que debe de existir alguna magia intermedia para crear la ilusión de que ```miCarritoDeLaCompra.obtenerPrecioTotal()``` se ejecute transparentemente y esta magia pasa por transmitir datos a través de la red. Si no te queda muy claro no te preocupes, he montado un pequeño vídeo para que puedas hacer el experimento y ver cómo funciona:

[TODO youtube]

Este tipo de tecnología floreció en la segunda mitad de los 90 y de alguna manera prometían mejorar la arquitectura de aplicaciones síncronas que solían utilizar variaciones de [RPC](https://en.wikipedia.org/wiki/Remote_procedure_call#History_and_origins) porque (de nuevo, en teoría) se adaptaban mejor a la orientación a objetos y casi no tendríamos que hacer cambios en el código para incorporarlas. Si llevas un tiempo en el negocio te sonarán productos como [RMI](https://es.wikipedia.org/wiki/Java_Remote_Method_Invocation), [DCOM](https://es.wikipedia.org/wiki/Modelo_de_Objetos_de_Componentes_Distribuidos) o [CORBA](//c2.com/cgi/wiki?WhatsWrongWithCorba). En este último caso se trataba de magia negra de la peor calaña y motivo suficiente para pedir la cuenta y buscar otra empresa.  De esta manera OC4j utilizaba HTTP para presentar las pantallas HTML a los usuarios pero internamente los nodos que componían el clúster servidor se comunicaban entre ellos usando referencias remotas.

> ¿Qué problema tienen las aplicaciones distribuídas? Muchos.

¿Qué problema tienen las aplicaciones distribuídas? [Muchos](//queue.acm.org/detail.cfm?id=1142044). Además de las incompatibilidades que había entre algunas implementaciones también te encontrabas con que el despliegue de aplicaciones de este tipo era complicado: un nodo con una versión incorrecta del código o una regla en un firewall cortando el tráfico y tu sistema empezaba a lanzar excepciones como si el mundo se terminase. A nivel de diseño de alguna manera el modelo de programación favorecía (gracias a su potencia) el acoplamiento entre componentes... algo que a esta alturas ya tenemos claro que solo trae problemas. 

En fin, en cualquier caso en algún momento los problemas de este enfoque se hicieron tan evidentes que las empresas que marcaban la innovación (porque amigos y amigas, antes la innovación en software la dirigían las grandes corporaciones como Oracle) decidieron que había llegado la hora de crear una alternativa. Algo más modernito. Que no diese problemas con el firewall. **Basado en eso que lo estaba petando, ya sabes, *la web***. La idea era crear aplicaciones independientes: nada de conexiones permanentes, nada de acoplamientos a nivel de código o librerías. Solo invocaciones HTTP que intercambiasen documentos. No se trataba de centrarte en una red de componentes sino de simplemente exponer la funcionalidad de negocio de tu aplicación al exterior. Ojo porque el cambio de granularidad es importante: dejas de pensar en rutinas y empiezas a pensar en documentos.

> Pusieron a trabajar a los de *marketing* y hey, esta gente cumplió: acuñaron el término *web services*.

Pusieron a trabajar a los de *marketing* y hey, esta gente cumplió: acuñaron el término *web services*. Hasta la basura más grande podría venderse bien con un nombre tan bueno como ese, y de hecho eso es exactamente lo que pasó. Porque como se hacía todo en esos momentos en lugar de crear un producto y probarlo en batalla se decidió que había que montar un comité que crease una especificación. ¿Qué podía salir mal? Como siempre, todo el mundo intentó meter cuchara: IBM, Microsoft, Verisign... el resultado fue una sopa de siglas y tecnologías (SOAP, UDDI, WSDL y un sinfín de ws-*) realmente complejas cuyas implentaciones eran desquiciantemente incompatibles. Y XML. XML everywhere, maldita sea. 

> Hasta la basura más grande podría venderse bien con un nombre tan bueno como ese, y de hecho eso es exactamente lo que pasó.

Pero al menos esa primera generación de web services trajo algo muy bueno, como he dicho antes: una serie de patrones de arquitectura que se basaban en interconectar aplicaciones independientes, no componentes de una única aplicación. En aquella época se llamó a este patrón *Service Oriented Architecture* y con el tiempo se demostró como la forma más eficiente de abrir los sistemas de información al exterior. Habían nacido las *web API* tal y como las conocemos: un conjunto coherente de operaciones invocables mediante HTTP.

¡Pero volvamos a la historia de Marc! Está claro que aunque no se dedicase ya a programar nunca dejó de llevar un techie dentro y que estaba muy al tanto de cómo se organizaba la arquitectura de un software complejo. Quería montar su propio negocio y quería hacerlo como una empresa diseñada desde el principio para operar en internet, así que le pidió pasta a un grupo de amigos (incluyendo al inefable [Larry](//www.expansion.com/economia-digital/protagonistas/2016/09/01/57c6f20be2704e34778b45b1.html)) y comenzó su aventura. 

Estábamos en 1999, en plena *burbuja .com* y aunque sabes cómo terminó todo en realidad está claro que algunas de las personas que se encontraban detrás de las empresas que protagonizaron esa bacanal tenían una visión muy clara de hacia dónde iba a evolucionar el mundo de la tecnología.

A Marc no le gustaban el software que se utilizaba para gestionar el perfil de los clientes por parte de los comerciales. Era una época en la que el movimiento Open Source no tenía la fuerza ideológica de hoy en día y muchas empresas **buscaban la fidelización del cliente básicamente atándolo** a su tecnología (Oracle sigue haciéndolo hoy en día, pero hey, esa es historia para otro momento). En cualquier caso debido a esta táctica de secuestro resultaba que integrar un *Customer Relationship Manager* con el workflow natural de la empresa era muy complicado, cuando si te lo paras a pensar resulta que es una parte esencial del mismo: una acción comercial puede necesitar programar reuniones (en el calendario) que se celebrarán en salas (que deben de estar libres), enviar avisos al resto de miembros involucrados (usando correo o mensajería), requerir la aprobación de condiciones de venta (por parte del responsable correspondiente), etc, etc.

Así que decidió montar una alternativa basada en web, que se cobrase por suscripción. Solo esto ya supuso una revolución y en cierto sentido **dio el impulso definitivo al primer tipo de cloud público que se popularizó**: el *Software as a Service* en el que pagabas por uso. Como modelo de negocio se había aplicado al correo electrónico y poco más pero ahora estábamos hablando de un producto de software clásico, una aplicación que englobaba mucho más que una funcionalidad concreta. 

Pero la *killer feature* de su producto fue la facilidad que aportaba para enlazarlo con cualquier otro sistema que tuviese la empresa: a principios del año 2000 [anunciaron](//www.prnewswire.com/news-releases/salesforcecom-launches-at-demo-with-over-150-customers-72423997.html) la publicación de su Application Program Interface. Mediante ella cualquier programa que fuese capaz de invocar HTTP podía interactuar con el producto intercambiando datos. Rápidamente surgió un ecosistema de funcionalidades creadas por terceros que enriqueció las que la criatura de Marc implementaba. El resto es eso, historia: se me había olvidado comentarte que el nombre de la empresa es *Salesforce* y que hoy en día tiene un valor de 49.000 millones de euros. No los pillo todos los días.

> Hoy en día tiene un valor de 49.000 millones de euros.

Rápidamente le siguieron eBay, Amazon, Yahoo, Google, Facebook, Twitter y otras empresas. En pocos años internet se convirtió en territorio API y nunca dejes de visitar de vez en cuando [programmableweb.com](//programmableweb.com) para maravillarte con perlas como la que te permite conocer mejor a [Chuck Norris](//www.programmableweb.com/api/chuck-norris-facts) o (si tu estómago lo admite) [pedir una pizza](//www.programmableweb.com/mashup/dom-dominos-pizza) en Domino's.

De alguna manera Salesforce ha impulsado tanto como AWS la tecnología cloud y por el camino esto hizo que Marc y Larry tuviesen algunos problemillas con su amistad. Nada que no se pueda solucionar comprando otro coche o pasando una semana en el yate, pero bueno, tuvimos [algunos episodios](//www.buscocrm.com/benioff-dissed.php) divertidos cuando Marc se enteró de que Larry estaba creando su propio CRM en Oracle y lo echó del consejo directivo de Salesforce o cuando Larry canceló la *keynote* con la que Marc iba a abrir el congreso mundial de Oracle horas antes de la inauguración.

Hoy en día cualquier producto que se desarrolle tiene que tener en su base un API basada en web services HTTP de manera que sea fácil automatizarlo, que sea fácil integrarlo en otros sistemas. Y la arquitectura de los sistemas modernos tiende a basarse en pequeños programas con lo que un API ya no solo es el mecanismo universal para publicar el sistema de cara al exterior: también es la forma en que se encadenan las piezas de un producto para realizar una labor compleja.

Y no te desesperes: en general cuando hablamos de web services hoy en día no nos referimos a ese infierno llamado SOAP que comentábamos antes. Casi siempre te encontrarás con APIs basadas en [REST](https://es.wikipedia.org/wiki/Representational_State_Transfer) de las que hablaremos (mucho) más adelante.

¿Y qué fue del bueno de Marc? Si quieres saber más sobre su vida puedes consultar la entrada en la [Wikipedia](https://en.wikipedia.org/wiki/Marc_Benioff) que ha escrito su mami (o al menos eso parece). Por lo visto finalmente recompuso su relación Larry "the devil" Ellison y hoy en día siguen jugando juntos al golf.

jv


ps: La imagen de de hoy la ceden los chiquitos de [401kcalculator.org](//401kcalculator.org). La música que sirve de cortinilla del vídeo es de [Marcus](https://soundcloud.com/musicbymarcus/promo-music-inspiational), como siempre.











