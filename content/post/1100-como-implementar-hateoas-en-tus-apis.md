---
title: Cómo implementar HATEOAS en tus APIs
date: 2017-03-17T22:14:20+01:00
description: "Te explico cómo crear APIs que aprovechen el modelo de hiperenlaces que ha hecho triunfar la web."
slug: como-implementar-hateoas-en-tus-apis
draft: true
tags:
- arquitectura
- programación
- java
- springboot
- hateoas
temas:
- API
niveles:
- Intermedio

episode : "16"
audio : ""
media_bytes : ""
media_duration : ""
images : [""]
explicit : "no"

disqus_identifier: como-implementar-hateoas-en-tus-apis
disqus_title: Cómo implementar HATEOAS en tus APIs
disqus_url: "https://programar.cloud/post/como-implementar-hateoas-en-tus-apis"
---

{{% img src="/media/1100-lidarose.jpg" alt="Documentación electrónica" %}}


*TL;DR: Los hiperenlaces tienen un papel tan importante en las APIs como en las pantallas para humanos y sin embargo casi nunca se implementan correctamente. Te cuento cómo solucionar este problema.*

{{% archive "como-documentar-con-spring-rest-docs" %}}
{{% github "https://github.com/programar-cloud/controlactividad/tree/1100" %}}


HATEAOS es un término inglés que traducido significa "Estoy desesperado buscando un acrónimo con gancho y no lo consigo encontrar". Pero detrás esta palabra encontrarás lo que durante veinte años ha sido el *core* de la web: el hipertexto, los enlaces.<!--more-->

> HTML y CSS son totalmente circunstanciales: fue la idea de tener enlaces entre *sites* en principio independientes lo que realmente impuso esta tecnología.

La posibilidad de navegar de forma natural sin tener que pensar demasiado a través de una maraña de documentos relacionados es el concepto que realmente convirtió el browser en una *killer application*. HTML y CSS son totalmente circunstanciales: fue la idea de tener enlaces entre *sites* en principio independientes lo que realmente impuso esta tecnología. Cada uno de nosotros tomamos responsabilidad sobre nuestra parte de la telaraña mundial y mantenemos una integración sencilla tanto con nuestro propio contenido como con el contenido externo mediante el uso de links. Es el mismo principio de evolución desacoplada que la infraestructura tomó como base para crear internet a partir de todo tipo de redes independientes aplicado a la información y estarás también encontrando paralelismos con el modelo de programación con microservicios del que hablamos en este blog.

Pero en cambio, cuando diseñamos APIs, olvidamos todo lo aprendido y nos dedicamos a soltar una lista de identificadores, objetos, etc sin relación explícita entre ellos. Por ejemplo, dime tú qué es más fácil de entender y usar si te doy estas dos opciones:

``` json
{
  "id" : 323423,
  "nombre" : "Game of Thrones",
  "categoria" : "Culebrones"
}
```

``` json
{
  "self" : "/libros/culebrones/323423",
  "nombre" : "Game of Thrones",
  "categoria" : "/libros/culebrones",
  "autor" : {
       "nombre" : "George R. R. Martin",
       "self" : "/autores/george-r-r-martin"
  }
}
```

¿Has olvidado quién es tu usuario? ¡Tu usuario es la persona que está desarrollando el cliente que accede a tu API! Y con la segunda opción le estás quitando el trabajo de construir las rutas necesarias para (por ejemplo) invocar una actualización de la ficha del libro: solo tendrá que hacer un ```PUT $self``` con los datos que hagan falta. Ídem para saltar al *parent* del objeto (en este caso, "categorías"). Y ya no te digo nada cuando lo que habías retornado era una lista paginada: si le ofreces los links para ir a la página anterior, a la siguiente, a la primera y a la última (por ejemplo) te va a adorar... más sobre esto en unos minutos.

> Estás desacoplando el cliente de las rutas utilizadas en el API.

Además (y es un *además* gigante) si tu usuario utiliza los links generados por ti en lugar de construirlos a partir de lo que entiende de la documentación va a ser mucho más difícil que los cree erróneamente y hasta cierto punto vas a poder modificarlos sin forzarle a rehacer el código: estás desacoplando el cliente de las rutas utilizadas en el API. Repite esta última frase un par de veces porque tiene más carga de lo que parece a primera vista.

Y ahora, un doble salto mortal con tirabuzón: Si te planteas el segundo ejemplo (el que utiliza hipertexto) como un nodo en un grafo ¡los enlaces te proporcionan las aristas disponibles! ¿No es maravilloso? ¡Tu aplicación queda descrita como un grafo y el nodo representa el estado actual!

Vale, ok, calma. Lo que quería decir es que estarás relacionando un determinado recurso (*Game of Thrones*, en este caso) con los posibles siguientes estados: el cliente podría perfectamente saltar de una pantalla en la que muestra esta información a otra que lista los libros clasificados como *culebrones* siguiendo la relación *categoría*. O bien puede averiguar más datos sobre el autor navegando a la propiedad ```$.self.autor.self```.

Generaliza esta idea y **tienes un mapa para representar las acciones que se pueden llevar a cabo desde cualquier lugar de tu API, quizá incluso sin que el cliente tenga que recordar información de contexto**. Y eso es BIEN porque de esta manera incluso tu cliente se convierte en *stateless*. Esto es lo que [Roy Fielding](https://es.wikipedia.org/wiki/Roy_Fielding) tenía en mente cuando creó REST en su [tesis doctoral](http://www.ics.uci.edu/~fielding/pubs/dissertation/top.htm) hace casi veinte años.

> Permiten crear unas aplicaciones más fiables desde el lado del cliente y más fáciles de actualizar en el servidor.

Mantén la concentración dos minutos más que ya casi estamos. Porque si añades un recurso *raíz* (mapeado a la ruta ```/```) con los links a los principales recursos de tu sistema ¡voilà! tendrás **un punto de entrada a partir del cual puedes ir tirando del hilo hasta llegar a todos los rincones de tu API** exactamente igual que haces con el ```index.html``` de un sitio web. Vale, vale: es posible que todavía estemos lejos de conseguir un cliente *universal* para APIs equivalente a lo que supone un navegador para una web. Pero los pasos que hacemos en esta dirección terminan facilitando el trabajo de todos y permiten crear unas aplicaciones más fiables desde el lado del cliente y más fáciles de actualizar en el servidor.

Ok, ahora ya entiendes por qué hablamos de "Hypermedia as the Engine of Application State" y Martin Fowler te dirá que estás en el camino de alcanzar [el nirvana del REST](https://martinfowler.com/articles/richardsonMaturityModel.html).

## Estándares de representación

Como somos muy ingenieros nos encantan los estándares. Y como no podía ser de otra forma existen varios de ellos para HATEOAS que compiten entre sí. Puedes chafardear [Hydra](http://www.markus-lanthaler.com/hydra/) o [Siren](https://github.com/kevinswiber/siren) pero posiblemente el más popular de todos sea [Hypertext Application Language (HAL)](http://stateless.co/hal_specification.html). La verdad es que [la especificación formal de HAL](https://tools.ietf.org/html/draft-kelly-json-hal-08) es bastante legible y algunos frameworks como Spring tiene un [soporte (muy parcial)](http://docs.spring.io/spring-hateoas/docs/0.23.0.RELEASE/reference/html/) para la misma.

## HAL (Hypertext Application Language)

Básicamente una respuesta HAL se representa con el *MIME type* ```application/hal+json``` o ```application/hal+xml``` y no es tan complicada como puede parecerte a primera vista. Te dejo un ejemplo a continuación describiendo el curso de diseño de APIs REST (puedes abrirlo a pantalla completa pulsando [aquí](/1100-ejemplo-hal.json) si te resulta más cómodo para visualizarlo):

``` json
{
  "codigo": "apirest",
  "titulo": "Diseño de APIs",
  "unidadesDidacticasCompletadas": 2000,
  "_links" : {
    "curies": [
        { "name": "cl",
          "href": "http://programar.cloud/relations/{rel}.html",
          "templated": true
        }
    ],
    "self" : { "href" : "/cursos/apirest",
               "type" : "application/vnd.programarcloud.curso" },
    "next" : { "href" : "/cursos/cultura",
               "type" : "application/vnd.programarcloud.curso",
               "title" : "Cultura DevOps" },
    "previous" : { "href" : "/cursos/cloud",
                   "type" : "application/vnd.programarcloud.curso",
                   "title" : "Infraestructura cloud" },
    "cl:inscribir" : { "href" : "/cursos/apirest/inscripciones",
                       "type" : "application/vnd.programarcloud.curso",
                       "title" : "Inscribirse" }
  },
  "_embedded" : {
    "profesores" : [
        { "email" : "javi@programar.cloud",
          "nombre" : "Javi",
          "_links" : {
            "self" : { "href" : "/profesores/javi",
                       "type" : "application/vnd.programarcloud.profesor" }
          }
        }
    ],
    "unidadesDidacticas" : [
      { "numero" : 1,
        "nombre" : "Arquitectura del primer proyecto",
        "_links" : {
          "self" : { "href" : "/cursos/apirest/unidades-didacticas/1",
                     "type" : "application/vnd.programarcloud.unidaddidactica" }
        }
      },
      { "numero" : 2,
        "nombre" : "El protocolo HTTP",
        "_links" : {
          "self" : { "href" : "/cursos/apirest/unidades-didacticas/2",
                     "type" : "application/vnd.programarcloud.unidaddidactica" }
        }
      }      
    ]
  }
}
```

Tranquilidad, mucha tranquilidad. Es largo pero fácil de entender. Para empezar explicita una serie de *propiedades* del objeto. Si estamos hablando de un curso podemos indicar el código, su título, etc.

A continuación vienen los ```_links``` que relacionan ese objeto con los siguientes estados a los que se sugiere poder saltar. En el caso de un curso podría incluir enlaces para recuperar los datos del curso que actúa como pre-requisito de este o el que supone su continuació natural. Pero también el hipertexto que necesitamos para llevar a cabo una acción como puede ser inscribir a un estudiante en él. Por supuesto que podríamos buscar otro enfoque para representar este último caso (¿un ```PUT``` a un recurso *inscripción*, quizá?) pero el que te comento es perfectamente aceptable.

Fíjate en que la clave que describe cada link indica su *relación* con el nodo de destino: ```self, previous, next```, etc. El IANA ha creado una lista con [varias relaciones estandarizadas para REST](http://www.iana.org/assignments/link-relations/link-relations.xhtml) pero también puedes inventar las tuyas propias. La única obligatoria es ```href``` que indica siempre la url necesaria para recuperar el recurso actual. Otro atributo de la relación interesante es ```type```. Úsalo para describir la estructura del objeto que se recuperará usando el enlace y que seguramente indicarás usando el [vendor tree](https://en.wikipedia.org/wiki/Media_type#Vendor_tree).

{{% imgur lFRTl0n "¿Dónde está el límite entre BIEN y la basura?"%}}

Hay un link especial, el *compact URI* o *curies*. Permite acortichar (término seguramente ya contemplado en el María Moliner) URIs para por ejemplo facilitar la documentación. Como te he dicho antes el IANA ha creado una lista importante de acciones que más o menos se van a repetir en muchos tipos de aplicaciones pero está claro que no es suficiente: tu dominio particular de negocio necesitará algunas adicionales (```inscribir```, por ejemplo) y tendrás que indicar dónde puede buscarse información con los detalles de su significado. Una posible solución consiste en usar el nombre de la acción como una URI: un identificador único que además puede leerse como una URL en la que dejar precisamente la documentación de la acción. Por ejemplo:

``` json
{
  ...
  "_links" : {
      "https://programar.cloud/relations/inscribir.html" : {
        "href" : "/cursos/apirest/inscripciones"
      }
  }
  ...
}
```

Pero claro, de esta manera terminamos con claves más largas que un día sin pan. En su lugar puedes definir un *curie* y aplicarlo como prefijo del nombre de la acción. En el fondo es el equivalente a un *namespace* de XML pero con un nombre mucho más *trendy*:

``` json
...
"curies": [
    { "name": "cl",
      "href": "http://programar.cloud/relations/{rel}.html",
      "templated": true
    }
],
...
    "cl:inscribir" : { "href" : "/cursos/apirest/inscripciones", ... },
...
```

Por último puedes evitar unos cuantos *roadtrips* entre el cliente y el servidor y añades en tu respuesta los datos que sabes que te van a pedir a continuación y para eso puedes utilizar la sección de *embeddeds*. Típicamente incluyes allí un resumen de los objetos asociados a la entidad que devuelves, en nuestro caso los profesores y las unidades didácticas.

Te estarás preguntando ¿pero no sería mejor incluir las unidades didácticas como una propiedad más del objeto? Es decir, algo así (fíjate que no hay *embeddeds*):

``` json
{
  "codigo": "apirest",
  "titulo": "Diseño de APIs",
  "unidadesDidacticasCompletadas": 2200,
  "unidadesDidacticas" : [{
    "numero" : 1,
    "nombre" : "Arquitectura del primer proyecto"}, ...],
  "_links" : { ... }
}
```

Puedes hacerlo, por supuesto. El problema es que entonces tendrás mucho más difícil mantener la coherencia con el formato de links: las unidades didácticas ya no son un recurso independiente al que puedas añadir propiedades HAL, con esta opción simplemente formarían parte de los datos de un curso de la misma manera que lo hace su título. Y ya no informas al usuario de tu API sobre las posibles acciones que puede ejecutar sobre ellas.

Y si publicas en ```/``` un documento como el siguiente tus usuarios podrán navegar desde la raíz hasta una unidad didáctica completa:

``` json
{
  "api": "programar.cloud lms",
  "version": "0.1.0",
  "_links" : {
    "profesores" : { "href" : "/profesores",
                     "type" : "application/vnd.programarcloud.profesor" },
    "cursos" : { "href" : "/cursos",
                 "type" : "application/vnd.programarcloud.curso" }  
  }
}
```

## Paginación

Cuando tu usuario pide una serie de recursos en lugar de uno solo está claro que hay un límite en la cantidad de información que debes devolverle. La solución habitual consiste en paginar y como ya te he comentado antes HAL le va a hacer la vida mucho más fácil al programador del cliente porque te hará incluir en la sección de ```_links``` la página anterior, la actual y la siguiente. Por supuesto los elementos paginados (o una parte de ellos) los añadirás como ```_embeddeds```.

En este enlace tienes [una animación demostrando HAL](http://imgur.com/a/ld319). Ocupa 500KB y como quizá estés viendo esto en el teléfono prefiero no gastarte tarifa de datos sin tu permiso, pero échale un vistazo en cuanto puedas. Comprobarás como implementar la paginación sobre los resultados es casi trivial porque solo tiene que utilizarse los enlaces ya generados para ello.

{{% imgur FgoEdpE "Paginación con HAL" %}}

Si pulsas en el enlace verás que al principio aparece la ruta raíz (```/```) enseñándote la lista de recursos disponibles a partir de ella. En este caso solo tenemos los cursos así que siguiendo su enlace saltamos a la primera página de su listado y también comprobarás que puedes utilizar las relaciones ```previous``` y ```next``` para navegar por todos los cursos existentes.

No me ha dado tiempo de completar el enlace a ningún curso que no sea el primero y tampoco el detalle del recurso ```UnidadDidactica```... pero aún así te puedes hacer una idea. Si quieres ejecutar tú mismo la demo solo tienes que descargarla del repositorio de código usando [la release 1100](https://github.com/programar-cloud/controlactividad/releases/tag/1100). Y si quieres más detalles sobre cómo funciona recuerda que estoy preparando un curso complementario a este totalmente orientado a código. He tenido que retrasar este proyecto pero ni se te ocurra pensar que lo he olvidado ;-)

## Diseño de tipos y DTOs

¿Recuerdas lo que te expliqué en el post sobre {{%ilink "como-crear-un-api-rest" "creación de APIs"%}}? Remarqué varias veces que tienes que pensar en tu usuario, en el programador o programadora que consume tus servicios. Y que la vida de esa personita era mucho más fácil si recibía una respuesta que pudiese utilizar directamente: objetos sencillos, con información adicional como el criterio de filtrado utilizado en la *query* (fechas, en nuestro ejemplo).

Así que aunque no lo vimos en ese ejemplo concreto es muy posible que las clases con las que defines las respuestas de tus web services sean muy simples, sin asociaciones complejas ni herencia de ningún tipo. Este patrón lo llamamos [Data Transfer Objects](https://es.wikipedia.org/wiki/Objeto_de_Transferencia_de_Datos_(DTO)). Estos objetos no tienen un gran carga semántica, no encajan muy bien con nuestra visión de la realidad y solo sirven para mantener en memoria un grupo de propiedades simples. Y si los usas a todo la largo del código corres el peligro de perder potencia simbólica. Los humanos somos animalitos simbólicos, animalitos que nos basamos en el significado de las palabras y los conceptos. Sin una semántica fuerte es mucho más fácil perder la visión del diseño y terminar creando una aplicación con componentes redundantes.

Bueno, pues estás de suerte: ahora está bastante claro que tus clases de negocio (las que implementan el turrón de tu aplicación) manipularán una serie de tipos que no se corresponderán con los que tus controladores (los objetos que publican tus webservices) retornarán. Porque estos últimos tienen que implementar las propiedades de HAL. Los controladores devolverán objetos representando un recurso REST mientras que el resto de tu aplicación puede usar la solución que quieras para manejar el dominio. En algún momento, por supuesto, tendrás que convertir entre una y otra representación... pero verás que no es tan complicado como podría parecer a primera vista.

En nuestro caso hemos pasado a utilizar clases que modelizan la actividad de un curso y la actividad de una unidad lectiva a implementar propiamente los tipos ```Curso``` y ```UnidadLectiva```. La carga semántica es claramente más fuerte y no te preocupes porque más abajo te cuento cómo sustituimos los DTOs por una clase que representa los recursos HAL.

## Implementaciones y ejemplos

Puedes encontrar un buen soporte para HATEOAS en algunas plataformas: [HATEOAS-Php](http://hateoas-php.org/) para Php y [Spring HATEOAS](http://projects.spring.io/spring-hateoas) para Java. En .Net y NodeJS no hay librerías que realmente se consideren la referencia (AFAIK!).

El soporte para HAL es incluso menor: [HAL-Php](https://github.com/blongden/hal) te puede ayudar si tu veneno es Php y Spring HATEOAS puede ser extendido con relativa facilidad para que te genere la mayor parte del código. No te pierdas este artículo sobre [cómo usar Spring HATEOAS](https://opencredo.com/hal-hypermedia-api-spring-hateoas/) para conocer cómo funciona esta librería... aunque siento decirte que el enfoque que le han dado no me termina de convencer, ahora te cuento el motivo.

¿Cuál es la justificación de estos frameworks? Básicamente puedes imaginarte que convertir una respuesta json simple en una basada en HAL añade un buen número de líneas al documento de salida que en el fondo son bastante *boilerplate*. En otras palabras: el ```href```, ```type```, etc es información que ya se encuentra en el código de nuestros tipos.

Spring HATEOAS intenta seguir [el DRY](https://es.wikipedia.org/wiki/No_te_repitas) para que por un lado tengas que escribir menos (en teoría) y por otro tu implementación sea más robusta: utiliza una combinación de introspección y *autoproxies* para recuperar la ruta en la que se publica el recurso asociado a la clase y de esta manera puede generar automáticamente atributos como el ```self```.

{{% imgur "ttnyWzH" "HAL con frameworks sofisticados" %}}

Sin embargo, en mi modestísima opinión, **esta vez la solución de Spring molesta más de lo que aporta** Dificulta la lectura del código y no es precisamente sencilla de entender. Así que mejor nos olvidamos de todo lo que te he contado en las últimas dos mil palabras y seguimos creando respuestas simples como hemos hecho hasta aho- ¿PERO NOS HEMOS VUELTO LOCOS? ¿Qué es lo que somos? ¡DESARROLLADORES! Si no nos convence una solución podemos montar la nuestra propia, programarla.

Ok, ok, a veces tiramos de este recurso a la ligera reinventando la rueda pero en este caso no es tan complicado y te dejo la base para ello en la versión de este post de [nuestro proyecto de ejemplo](https://github.com/programar-cloud/controlactividad/tree/1100). Revisa el paquete [cloud.programar.hateoas](https://github.com/programar-cloud/controlactividad/tree/1100/src/main/java/cloud/programar/hateoas) para ver cómo en unas pocas líneas se puede resolver la situación de forma práctica y fácilmente transportable a otros lenguajes de programación.

En la clase [CursosCtrl](https://github.com/programar-cloud/controlactividad/blob/1100/src/main/java/cloud/programar/lms/controlactividad/CursosCtrl.java) puedes encontrar un ejemplo que te enseñará a usar la librería, en un momento te muestro el código relevante... verás que es bastante autoexplicativo. En el curso paralelo a este centrado en programación te contaré los detalles de implementación. Por supuesto también puedes echar un ojo al [test implementado en ResourceTest](https://github.com/programar-cloud/controlactividad/blob/1100/src/test/java/cloud/programar/hateoas/ResourceTest.java) para entender el comportamiento de esta pequeña librería. Aquí te dejo un extracto de su uso:

``` java
Curso curso = CURSO_EXISTENTE; // Simula la recuperación del curso a partir de su código
String self = CURSO_URL.replace("{codigo}", curso.getCodigo());
Resource<Curso> resourceCurso = new Resource<>(curso, apiRoot)
        .addAdditionalPropertyIfNotNull("desde", desde)
        .addAdditionalPropertyIfNotNull("hasta", hasta)
        .addLink("self", self);

for (UnidadDidactica ud : curso.getUnidadesDidacticas()) {
    String self = UNIDAD_DIDACTICA_URL
            .replace("{codigo}", curso.getCodigo())
            .replace("{numero}", ud.getNumero());
    Resource<UnidadDidactica> resourceUD = new Resource<>(ud, apiRoot)
            .addLink("self", self);
    resourceCurso.addEmbedded("unidades_didacticas", resourceUD);
}
```

Y hablando de tests... ¿cómo los implementamos? ¡Spring REST Docs for the win, por supuesto! Recuerda que ya tengo un {{% ilink "como-documentar-un-microservicio-con-spring-rest-docs" "post dedicado íntegramente a él"%}}.

## Conclusiones

Si quieres ver la aplicación de HAL en un caso real tienes que visitar [la documentación del API de Paypal](https://developer.paypal.com/docs/api/hateoas-links/). También encontrarás súper interesante el [explorador de Foxycart](https://api-sandbox.foxycart.com/hal-browser/browser.html#https://api-sandbox.foxycart.com/): es una aplicación web que termite aprender el API de esta plataforma de *ecommerce* navegando por ella. **Seguramente es la demostración más directa que puedas encontrar sobre hasta qué punto el concepto de Hipermedia mejorará tu capacidad para crear aplicaciones orientadas a APIs**.

No olvides supervitaminarte y mineralizarte. Y nos vemos dentro de nada hablando de autorización y autentificación de llamadas REST en... ¡programar.cloud!

jv

pd: Sonríe, que ha vuelto la música de [Marcus](https://soundcloud.com/musicbymarcus).

ppd: En la foto que acompaña al post (hecha y compartida por [Lida](https://www.flickr.com/photos/lidarose/251573637/)) puedes ver el equivalente a un sitemap para el API de Github. Pero solo si vas muy borracho, lo normal es que veas una tela de araña.

pppd: Ok, ok, por un día abandono mi boicot a Scott Adams y sus tiras de Dilbert. No te pierdas este artículo sobre [cómo Trump le tiene hipnotizado](https://www.bloomberg.com/news/features/2017-03-22/how-dilbert-s-scott-adams-got-hypnotized-by-trump). ¡Es aún más largo que los míos! Y de una manera bastante elegante (aunque no sutil) explica su comportamiento y la visión algo cínica que tiene del mundo.

pppd: He recuperado a nuestro vividor favorito directamente desde el artículo en el que hacía {{% ilink "cloud-es-donde-se-ejecutan-las-aplicaciones" "una introducción al cloud"%}}. Espero que no lo hayas echado de menos porque no se lo merece :)

ppppd: De nuevo, prometo intentar publicar con regularidad. Aunque ahora mismo no soy capaz de comprometerme sobre el significado de esa palabra. Pero que sepáis que leeros por [Twitter](http://twitter.com/ciberado) o cualquier otro medio me carga pilas para dedicarle un rato al blog.

pppppd: ¡Y acordaros de que compartir es ❤! ¡Pasadle el post a vuestros compis, usad la sección de comentarios, obligad a vuestra pareja a leerlo!
