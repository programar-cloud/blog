---
title: Cómo documentar un microservicio (incluyendo Swagger)
date: 2017-01-20T22:14:20+01:00
description: "Te cuento cómo enfocar la documentación de tus web services para mantenerla siempre actualizada utilizando la solución más popular a día de hoy."
slug: como-documentar-un-microservicio-con-swagger
draft: false
tags:
- arquitectura
- programación
- java
- springboot
- documentacion
temas:
- API
niveles:
- Intermedio

episode : "14"
audio : "https://ia601500.us.archive.org/6/items/como-documentar-un-microservicio-con-swagger/como-documentar-un-microservicio-con-swagger.mp3"
media_bytes : "25181409"
media_duration : "29:19"
images : ["https://programar.cloud/media/1080-papiro-de-ani.jpg"]
explicit : "no"

disqus_identifier: como-documentar-un-microservicio-incluyendo-swagger
disqus_title: Cómo documentar un microservicio incluyendo Swagger
disqus_url: "https://programar.cloud/post/como-documentar-un-microservicio-con-swagger"
---

{{% img src="/media/1080-papiro-de-ani.jpg" alt="Papiro de Ani" %}}


*TL;DR: Nos pagan por entregar valor. Invertir tiempo en crear documentos que nadie va a leer no tiene sentido pero publicar un API sin explicar cómo funciona es aún peor. Te cuento cómo encontrar el equilibrio entre ambos extremos y te explico por qué NO usarás Swagger (a medio plazo).*

{{% archive "como-documentar-un-microservicio-con-swagger" %}}

<!--more-->

## Ni contigo ni sin ti

¿Has conocido a alguien que después de un desengaño amoroso se haya convertido en un cínico o una cínica? Ya sabes, una reacción extrema de despecho. Por suerte la mayor parte de la gente que pasa por esta experiencia terminan reequilibrándose con el tiempo y superan el trauma pero siempre hay quien no vuelve a ser persona. Algo así me pasó a mi con el tema de la documentación, luego te cuento.

Como siempre vamos a hacer un viaje conceptual. Pero calma porque no voy a dejar las cosas en el aire: prometo que tendrás Swagger. Porque piensas que te enamorarás de ese producto. Y ya te lo adelanto: va a ser tu primer gran desengaño.

{{% imgur 7ycQ7kF "Promesas promesas promesas" %}}

## Razones del desamor

Pero primero déjame que para empezar te diga que usamos la misma palabra para englobar ideas bastantes distintas, como explicaba perfectamente Verónica Forqué en [¿Por qué lo llaman amor cuando quieren decir Sexo?](http://www.fotogramas.es/Peliculas/Por-que-lo-llaman-amor-cuando-quieren-decir-sexo). Es lo que nos pasa con el término *documentación*: engloba temas tan dispares como los requerimientos de la aplicación, los comentarios en el código o la información sobre las rutas que publican tus operaciones del API y los parámetros que necesitan.

¿Recuerdas {{% ilink "devops-en-serio" "mi proyecto en el infierno" %}}? En él hicimos una aproximación clásica a la documentación, un *waterfall* de libro, y terminamos generando cientos y cientos de páginas de texto que no guardaban ninguna coherencia entre ellas *antes* de probarlas con código. Y claro, el corazón se resiente.

> Durante todos los años de tu formación dedicaron una cantidad de energía increíble a enseñarte UML hasta el punto de que realmente saliste creyendo que el 80% de tu trabajo en el mundillo consistiría en hacer dibujitos.

Estoy bastante seguro de que a ti también te ha pasado algo así en uno u otro momento: seguramente hace años te despertaste un día y dijiste "umh... me pregunto cuando terminaré haciendo el [análisis sintático de una oración subordinada](http://elvelerodigital.com/apuntes/lyl/sintaxis_oc.htm) o aplicando UML en un proyecto". Porque durante todos los años que duró tu formación los profesores dedicaron una cantidad de energía increíble a enseñarte el [Unified Modeling Language](https://es.wikipedia.org/wiki/Lenguaje_unificado_de_modelado) hasta el punto de que realmente saliste creyendo que el 80% de tu trabajo en el mundillo de la programación consistiría en hacer dibujitos. Y en cambio es muy posible que ni siquiera los hayas vuelto a utilizar. Si lo has hecho espero fuese informalmente, para comunicar ideas y aclarar la arquitectura general de tu modelo de entidades, no para describir hasta el último detalle tu código y su comportamiento. Porque para eso no sirve, te cuento el por qué en un momento.

{{% imgur "K2Rg1ro" "Nunca debimos salir del tty"%}}

Como te decía con esta clase de desengaños llega el cinismo: el "la documentación no sirve para nada, es una pérdida de tiempo" fue mi *motto* durante unos meses cuando me largué de ese proyecto maldito. Fíjate bien, no es que me quejase de que no me apetecía documentar o que no tenía tiempo para hacerlo. Es que estaba convencido de que realmente afectaba de manera negativa al progreso del proyecto y generaba confusión en lugar de reducirla. Primero porque **reducía las oportunidades de comunicación entre el equipo** al convertir el "míralo en la doc" en una coletilla recurrente, segundo porque **resultaba inabarcable y por lo tanto incoherente** y tercero (y este fue realmente el causante de varios dramas) porque **la sincronización entre el papel y la implementación difería cada vez más**.

Por ello durante bastante tiempo defendí a capa y espada que la mejor documentación es el código. Estaba equivocado, claro.

## No eres tú, soy yo

Por supuesto que estaba equivocado. Y no porque no reconociese correctamente los problemas si no porque la solución que defendía era pueril. En realidad una excelente documentación es imprescindible y lo realmente importante es ser efectivo a la hora de crearla. No todos los docs que desarrollas tienen la misma finalidad así que puedes aplicar distintas tácticas para cada grupo de ellos y conseguir un buen resultado. Te cuento por encima algunas, a modo de orientación general. Y luego entramos en detalle con el tema del API.

### Documentar la visión global

Necesitas poder explicar a los demás en qué consiste tu proyecto, qué problema soluciona. ¿Sabes quién va a reelerlo más a menudo? Exacto, tú. Te va a servir para mantener la visión y el foco. Para recordarte qué es prioritario y qué es accesorio.

Y puedes escribir un libro sobre ello (que nadie va a leer) o generar un pequeño ```README.md``` en la raíz del código. Usa  [Markdown](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet) ftw; aquí te dejo una [guía con ejemplos y patrones](https://github.com/matiassingers/awesome-readme).

{{% imgur "PklPJHf" "Documentación como terapia"%}}

¿Te parece escaso? Compara la documentación que te entrega la gente de Ikea con la que recibes cuando compras un coche. Ikea te transmite una idea clara de los componentes del producto y te explica cómo ensamblarlos para conseguir lo que buscas. Normalmente les basta con dos o tres páginas de garabatos y a poco que tengas experiencia sabes que el tiempo invertido en verlos compensa de sobra los desastres que puedas crear con el "quita, quita, que las instrucciones son para cobardes".

En cambio el coche te lo dieron con un manual de 200 páginas o más, bajando al detalle detallado incluso con esquemas de circuitos electrónicos y todo tipo de información técnica. ¿Cuántas veces lo has leído? No digo ojeado, digo leído. ¿Cero? El [manual del Reanult Twingo](https://dl.dropboxusercontent.com/apitl/1/AADlbAryw9tn5XRLMvrQIEJvVCT9P1UVx368JQ-LDLhMLoaL5AfjJk6oD-CgS-zf1DIdCZxkYZHDSaZapZ1yecDU1k1ij2-2Yl3pU01UGqzP_PERDU6LrOIEFNWQQsgS90Sj_Y29dasDVD0F9pLQj9nsOkj3CZ7qJK7u7ulenZFlD8zTb_PmxSrEREVFC6_39CcwjYEvS4tFcSFyZmOICxPHPGjEKvf0ZlaReILQTXCcHH7BB8n7indoF-FH_5897w4) tiene más de 250 páginas. Del Twingo. No de un Airbus a380.

{{% imgur "806sShz" "Ahá... cuéntame más" %}}

Vale, vale, calma: es solo una analogía. Intenta quedarte con el mensaje, no con los detalles de implementación :p Tu documentación global tiene que ser un mueble de Ikea. Algo que no sea solo útil si no algo que incite a la lectura. Y no lo vas a conseguir si es más largo que una novela corta.

### Documentar los requerimientos

Desde luego de alguna manera hay que plasmar las tareas a realizar, aunque solo sea para repartirlas y saber qué está haciendo cada miembro del equipo. Pero en la mayoría de los proyectos no tiene ningún sentido invertir semanas o meses en definir hasta el último detalle los requerimientos del sistema: es infinitamente más práctico tener acceso al cliente (a través de la figura del *product owner*, por ejemplo) para ir pidiendo aclaraciones de los detalles a medida que se necesitan. Esta información puede terminar plasmándose en [historias de usuario](http://www.mountaingoatsoftware.com/agile/user-stories) con un formato de ficha muy sencillo y manejable.

Desde luego esto solo vas a poder aplicarlo si sigues una metodología de venta y desarrollo basada en algún framework ágil, intentaré hablar sobre esto cuanto antes.

### Documentar el código

El código no es la única documentación pero desde luego sigo pensando que es la más importante. Tienes que conseguir que su lectura sea fácil de manera que sea sencillo entender cada pieza. La mayor dificultad aquí es la sincronización entre la documentación y el código en sí y la única forma de conseguir este objetivo es incrustándola: así, si modificas una parte del código, puedes en ese mismo momento actualizar la documentación.

<span style="float:right; font-size:70%; clear:both;">[mejor comentario de la historia](http://stackoverflow.com/questions/184618/what-is-the-best-comment-in-source-code-you-have-ever-encountered)</span>

```
/**
* For the brave souls who get this far: You are
* the chosen ones, the valiant knights of programming
* who toil away, without rest, fixing our most awful
* code. To you, true saviors, kings of men, I say this:
* never gonna give you up, never gonna let you down,
* never gonna run around and desert you. Never gonna
* make you cry, never gonna say goodbye. Never gonna
* tell a lie and hurt you.
*/
```

Hoy en día cualquier plataforma te permite hacerlo pero la primera que realmente popularizó este mecanismo fue Java. La idea es que puedes añadir antes de casi cualquier elemento del programa un comentario enmarcado entre ```/**``` y ```*/``` para después usar una herramienta llamada ```javadoc``` que es capaz de analizar los ficheros java y generar en base a ellos una serie de páginas HTML.

Algo que ya no valoramos como se merece es que como la herramienta conoce las relaciones que hay entre las diferentes estructuras del código toda la documentación está hiperenlazada entre ella con lo que es muy fácil averiguar más detalles sobre (por ejemplo) el tipo del parámetro de una rutina. Solo tienes que pulsar en el link correspondiente.

Además veremos que puedes usar ```maven``` para ejecutar ```javadoc``` con lo que la generación de la documentación técnica formará parte de tu proceso de integración continua.

Te pongo un ejemplo, a ver qué te parece. Y deja de rantear de Java un rato, no es que sea perfecto ni mucho menos pero es un lenguaje más divertido de lo que crees.

``` java
/** Representa un marcianito. */
public class Marcianito extends Sprite {
  /** Identificador del marciano. */
  private int id;

  /** Velocidad a la que se desplaza */
  private double velocidad;

  ...
}
```

¿Cómo lo ves? Exacto. **Pura basura**. Estás escribiendo dos veces lo mismo, en castellano y en Java. En lugar de seguir el principio de [don't repeat yourself (DRY)](http://wiki.c2.com/?DontRepeatYourself) explicas algo que debería ser obvio. Es una documentación totalmente inefectiva. En cambio esto tendría mucho más sentido:

```java
/** Los marcianitos representan a los enemigos en el juego. */
public class Marcianito extends Sprite {
  /** El id se autoasigna al guardarse en la base de datos. */
  private int id;

  /** Velocidad a la que se desplaza en metros por segundo */
  private double velocidad;
}
```

Ahora sí estamos aportando datos que facilitan comprender la estructura del código. Y aún habría sido mejor eliminar el último comentario, para ello solo tienes que cambiar el nombre de la variable a ```private double velocidadMetrosPorSegundo```. Y esto tiene el efecto adicional de qué estás documentando esa variable aparezca donde aparezca, no solo en su definición: cuando encuentras la línea ```velocidadMetrosPorSegundo = velocidadMetrosPorSegundo + 1``` sabes exactamente que está pasando. Mira, este es el resultado de lanzar ```javadoc``` contra ese trocito de código:

{{% imgur "c8RIUYY" "javadoc para marcianitos" %}}

### Documentar tu API

Ya estamos llegando a donde queríamos. ¿Qué hacemos con el API de nuestro web service? ¿Qué hacemos con los servicios REST? Tenemos que documentar los recursos que manipulamos, las operaciones que definimos a su alrededor, los parámetros que precisan, el resultado que obtenemos al invocarlas. ¿Cómo lo hacemos?

En este post voy a enseñarte cómo se utiliza [Swagger](http://swagger.io) para este trabajo. **A día de hoy es el estándar de facto para este tipo de proyectos prácticamente en cualquier plataforma así que aunque solo sea por cultura tienes que conocerlo**. Existen alternativas como [Raml](http://raml.org)  y [Slate](https://github.com/lord/slate) pero no tienen ni de lejos el mismo nivel de popularidad.

{{% imgur "zSmIAxy" "" %}}

Pero espera, pisa freno y primero dale vueltas a esto: **plantéate quién es el usuario de tu API. Exacto, es otro programador**. Tienes que crear una documentación adecuada para este perfil. Por un lado es una documentación técnica (no muy diferente a la que genera ```javadoc```) pero también estás describiendo un contrato: quien la utilice está construyendo un producto sobre ella y por lo tanto espera que sea precisa (no ambigua), exhaustiva y que esté perfectamente sincronizada con el código.

Y aquí es donde en el fondo tienes dos posibles caminos. El primero (*bottom up*) es añadir la documentación de tu API al código. Tiene un clarísimo efecto positivo que es la localidad (la implementación está al lado de la documentación) con la facilidad de mantenimiento que ello implica. Pero también tiene el problema de que al estar mezclada con las líneas de tu lenguaje de programación favorito resulta difícil ver la evolución de posibles cambios mediante un simple ```diff``` en tu control de versiones. También tienes la limitación de que si no empiezas a picar la implementación de tu web service no puedes tener la documentación de tu API.

La alternativa obvia es el *top down*: definir el contrato usando la sintaxis específica del producto que decidas utilizar y por lo tanto utilizando lo que en el fondo es un lenguaje de programación declarativo (en el caso de Swagger usarás YAML) a partir del cual generar el código de tus controladores y de los clientes que se conecten a ellos. En el fondo **¡estás construyendo una especificación de tu API!** Si quieres que este enfoque funcione tienes que utilizar herramientas que lo automaticen o siempre van a haber discrepancias.

Swagger te proporciona [un editor](http://editor.swagger.io/#/) para ayudarte en el proceso de creación. Tiene *snippets* incorporados para que no tengas que teclear tanto y previsualiza el resultado en tiempo real y también puedes pedirle que te genere los esqueletos de código de los que hemos hablado antes. Aquí tienes un ejemplo de especificación en el que he colapsado algunos nodos para que puedas ver la estructura más claramente:

{{% imgur "Jo5C6Nw" "Especificación Swagger" %}}

El segundo método basado en declarar primero el API parece más elegante y desde luego hace mucho más fácil tracear la evolución del contrato por el simple método de hacer un diff entre dos versiones del fichero que declara el API. Por otro lado supone añadir un lenguaje más a tu proyecto (aunque sea un [dsl](http://swagger.io/specification/)) y en mi caso particular lo cierto es que no soy en absoluto partidario de los generadores de código: por muy cuidadoso que seas, cada vez que conviertes la especificación en un esqueleto estás sobrescribiendo ficheros. Esto hace imposible añadir todas las anotaciones que necesitas para definir una operación de tu API en el mismo lugar: como mínimo tendrás el fichero de interfaces autogenerado y el de la implementación.

En definitiva este enfoque tiene sentido si en tu casa se utilizan varios lenguajes de programación diferentes y el diseño del API corre a cargo de un equipo mientras que su implementación es responsabilidad de otros. Los primeros solo tendrán que pelearse con una tecnología (los documentos YAML de Swagger, por ejemplo) independientemente de si los segundos usan Java, Scala o NodeJS... pero obviamente esto va en contra de nuestro mantra de ganar agilidad.

## Esto va a ser sucio y divertido

{{% activity %}}
En la [versión actual](https://github.com/programar-cloud/controlactividad/tree/1080) del proyecto te he añadido todo lo necesario para utilizar Swagger, no dejes de echarle un vistazo después de terminar el post ¿ok? Céntrate en la clase [ActividadUnicoCursoCtrl](https://github.com/programar-cloud/controlactividad/blob/1080/src/main/java/cloud/programar/lms/controlactividad/ActividadUnicoCursoCtrl.java).
{{% /activity %}}

En el curso paralelo sobre implementación te explicaré todos los detalles sobre qué tienes que añadir a tu proyecto para integrar Swagger en él con un enfoque *bottom-up* pero ahora mismo déjame que te diga cómo ver el resultado de hacerlo: descarga la [release 0.0.3](https://github.com/programar-cloud/controlactividad/releases/download/1080/controlactividad-0.0.3-SNAPSHOT.jar) y ejecuta la aplicación (por ejemplo, con un ```java -jar controlactividad-0.0.3-SNAPSHOT.jar```).

A continuación abre con tu navegador la dirección ```http://localhost:8080/swagger-ui.html```. ¡Tachán! Swagger genera una descripción del API en tiempo de ejecución y te la presenta como documentación viva. En realidad lo que estás viendo es una pequeña aplicación que lee la especificación que puedes chafardear en ```http://localhost:8080/v2/api-docs``` y la presenta visualmente.

{{% imgur "dSOjAdT" "Swagger UI" %}}

La parte que más te va a llamar la atención (y que es un +1 enorme) **es que la documentación generada automáticamente es interactiva y puedes utilizar un formulario para hacer pruebas y aprender el funcionamiento del API**. Desde el punto de vista de tu usuario (¡otro equipo de desarrollo, recuerda!) esto es fantástico y estoy seguro de que es lo que ha convertido a Swagger en la herramienta de referencia para este trabajo. Pero a partir de aquí comienzan los problemas.

> Es un error de diseño fundamental de Swagger, no un bug: este producto define una operación como la suma de un verbo HTTP (```GET```, ```POST``` o lo que sea) y una ruta.

El más importante... ¿no echas de menos algo? Mira bien la imagen anterior. Exacto: solo aparece una operación de las cuatro que tenemos definidas, en este caso la que produce imágenes. Y esto es un error de diseño fundamental de Swagger, no un bug: este producto define una operación como la suma de un verbo HTTP (```GET```, ```POST``` o lo que sea) y una ruta. En cambio nuestro código tiene implementaciones independientes de la operación dependiendo del tipo de resultado que quieras recuperar (el valor del ```Accept```) y no queremos ejecutar la misma rutina si el cliente pide una imagen que si lo que necesita son los datos tabulados en CSV.

En otras palabras: no vas a ser consciente de que puedes obtener más que un tipo de documento concreto como resultado. Y repito, esta decisión se ha tomado conscientemente y forma parte de la arquitectura de Swagger, no es algo que se pueda modificar sin romper todo su ecosistema. Dicen que es posible que en la versión 3 la reconsideren pero mientras tanto es lo que hay.

O sea que si quieres que tu documentación se base en esta tecnología tendrás que crear rutas diferentes para cada tipo de respuesta. Por ejemplo tendrás que desdoblar

```
/cursos/{codigo}/unidades-didacticas/actividad
```
en versiones como

```
/cursos/{codigo}/unidades-didacticas/actividad.xml
/cursos/{codigo}/unidades-didacticas/actividad.json
/cursos/{codigo}/unidades-didacticas/actividad.png
/cursos/{codigo}/unidades-didacticas/actividad.jpeg
/cursos/{codigo}/unidades-didacticas/actividad.csv
```

No parece tan grave ¿verdad? Bueno, el caso es que de repente tu documentación está llena de operaciones que verás como diferentes aunque en el fondo hacen el mismo trabajo.

Hay otros problemillas, como que si utilizas Spring Framework la cantidad de anotaciones redundantes que puedes llegar a tener que añadir a tu código para describir en Swagger algo que ya estás explicando en Spring MVC puede llegar a enterrar las líneas que implementan las operaciones. Por suerte el proyecto [Springfox](TODO!) intenta minimizar este punto quitando la mayoría de datos redundantes.

{{% imgur E9IAbzc "Desarrolladora Java enterrada en anotaciones" %}}

Otro problema inherente a estos sistemas de análisis automáticos es que es muy difícil que puedan llegar a entender tus rutinas para conocer los posibles códigos de estado HTTP que devuelves: o añades (one more time) esta información como metadatos adicionales o vas a tener una documentación incompleta.

## Démonos una segunda oportunidad

Pero sé que nada de esto va a evitar que caigas rendido o rendida a los pies de Swagger. Es simplemente demasiado popular y por otra parte no cuesta tanto aprender a utilizarlo. Ha servido durante años a felices equipos de desarrollo y en el fondo meterlo también en tu cinturón de Batman es algo que tarde o temprano rentabilizarás. Y tampoco hace falta invertir un mes de reclusión estricta para aprenderlo, solo tienes que tener claras las dependencias y el mecanismo de anotación correspondiente o pelearte con otra gramática YAML más. Así que, maldita sea, aprende Swagger.

Pero tarde o temprano madurarás y alcanzarás el [nirvana de las aplicaciones REST](https://martinfowler.com/articles/richardsonMaturityModel.html) y querrás usar hipermedia en tus APIs. Ese será el momento de la ruptura, cuando te des cuenta de que Swagger no soporta HATEOAS. Pero todavía nos quedan un par de capítulos antes de llegar a ese punto de la historia. Si quieres un spoiler, échale un ojo al [vídeo de   Hanselman](https://azure.microsoft.com/es-es/resources/videos/hateoas-rest-and-hypermedia-primer-with-mat-velloso).

## He conocido a otra persona

En el próximo capi te hablo de cómo dar un enfoque distinto a la documentación del API. Es una alternativa súper interesante, aunque es verdad que vas a tener que explorarla a la vez que lo hago yo porque es un proyecto muy reciente y no he tenido oportunidad de aplicarlo en la vida real (tm). No dejes de explicarme tus experiencias con él, por favor.

Esperando que podamos seguir siendo amigos, se despide

jv

pd: ¿Por qué no le echas un oidazo al [resto de composiciones](https://soundcloud.com/musicbymarcus) que tiene Marcus? Yo utilizo la que más me hace sonreír en el podcast del blog.

ppd: La foto de portada corresponde al diagrama que documenta la arquitectura de una aplicación de dos capas, con los frontales al norte y un gran servidor Oracle en el sur rodeado por varias instancias Redis. Bueno, no, es parte del [Papiro de Ani](https://es.wikipedia.org/wiki/Papiro_de_Ani).

pppd: [Manuel](https://twitter.com/Asincrono) me ha corregido un typo en el artículo {{% ilink "el-nacimiento-de-los-web-services" "sobre el origen de los web services" %}}, mil gracias. No os perdáis [su canal de Youtube](https://www.youtube.com/channel/UCmwrG3talbsQTFoi5r51v1A), está on fire enseñando Elixir y programación funcional.

ppppd: Si queréis echarme una mano editando las entradas solo tenéis que visitar el [repo del blog en github](https://github.com/programar-cloud/blog/) y crear una *pull request*. Si no tenéis claro cómo se hace decídmelo y monto un vídeo.

ppppppd: Si estás leyendo esto en el ordenador tienes a la izquierda, más pequeñito de lo que debería estar, un botón para tuitear el post. Así me ayudas a que lo conozca más gente.

pppppppd: ¡Super kudos para mi amigo [Uri](https://twitter.com/iundarigun)! Ha traducido y publicado el post que habla {{% ilink "que-son-los-microservicios" "sobre qué es un microservicio" %}} al portugués brasileño en [su blog sobre programación](http://devcave.com.br/o-que-e-um-microservice/) :D

ppppppppd: UML sigue siendo muy práctico para comunicar ideas y organizar tus pensamientos. Si quieres una aproximación directa al turrón no te pierdas el [UML Gota a Gota](https://books.google.es/books?id=AL0YkFeaHwIC&printsec=frontcover&hl=es&source=gbs_ge_summary_r&cad=0#v=onepage&q&f=false) de [San Martin Fowler](http://martinfowler.com/).

pppppppppd: Aparentemente Scott Adams (el creador de Dilbert) [se ha convertido en uno de sus personajes y defiende el nombramiento de Trump](https://qz.com/791253/dilbert-creator-scott-adams-has-endorsed-donald-trump-in-the-most-dilbert-way-possible/) con [argumentos peregrinos](http://elabismodelcalamar.blogspot.com.es/2011/08/argumentacion-peregrina.html). Mi opinión al respecto se resume en que creo que si el planeta sigue entero en 2020 hay una probabilidad muy buena de que la raza humana sea lo suficientemente resiliente para no extinguirse este siglo.
