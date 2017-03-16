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

{{% img src="/media/1090-kindle-from-maxpixel.jpg" alt="Documentación electrónica" %}}

*TL;DR: Los hiperenlaces tienen un papel tan importante en las APIs como en las pantallas para humanos y sin embargo casi nunca se implementan correctamente.*

{{% archive "como-documentar-con-spring-rest-docs" %}}

## ¿Qué es HATEOAS?

HATEAOS es un término inglés que traducido significa "Estoy desesperado buscando un acrónimo con gancho y no lo consigo encontrar". Pero detrás él verás lo que durante veinte años ha sido el *core* de la web: los hiperenlaces.

La posibilidad de navegar de forma natural sin tener que pensar a través de una maraña de documentos relacionados es el concepto que realmente convirtió el browser en una *killer application*. HTML y CSS son totalmente circunstanciales: es la idea del enlace entre aplicaciones en principio independientes lo que realmente impuso esta tecnología: cada uno de nosotros tomamos responsabilidad sobre nuestra parte y mantenemos una integración sencilla tanto con nuestro propio contenido como con el contenido externo mediante el uso de links.

Y en cambio, cuando diseñamos APIs, olvidamos todo lo aprendido y nos dedicamos a soltar una lista de identificadores, objetos, etc sin relación explícita entre ellos. Dime tú qué es más fácil de entender y usar si te doy estas dos opciones:

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
  "categoria" : "/libros/culebrones"
}
```

¿Has olvidado quién es tu usuario? ¡Tu usuario es la persona que está desarrollando el cliente que accede a tu API! Y con la segunda opción le estás quitando el trabajo de construir las rutas necesarias para (por ejemplo) invocar una actualización de los datos del libro: solo tendrá que hacer un ```PUT $self``` con los datos que hagan falta. Ídem para saltar al *parent* del objeto (en este caso, "categorías"). Y ya no te digo nada si lo que habías retornado era una lista paginada: si le ofreces los links para ir a la página anterior, a la siguiente, a la primera y a la última (por ejemplo) te va a adorar.

Además (y es un *además* gigante) si tu usuario utiliza los links generados por ti va a ser mucho más difícil que los creen erróneamente y hasta cierto punto vas a poder modificarlos sin forzarles a rehacer el código: estás desacoplando el cliente de las rutas utilizadas en el API.

Y ahora, un doble salto mortal con tirabuzón: Si te planteas el segundo ejemplo (el que utiliza hipertexto) como un nodo en un grafo ¡los enlaces te proporcionan las aristas disponibles! ¿No es maravilloso? ¡Tu aplicación queda descrita como un grafo y el nodo representa el estado actual!

Vale, ok, calma. Lo que quería decir es que relacionando un determinado objeto (*Game of thrones*, en este caso) con los posibles siguientes estados: el cliente podría perfectamente saltar de una pantalla en la que muestra esta información a otra que lista los libros clasificados como *culebrones*. Generaliza esta idea y tienes un mapa para representar las acciones que se pueden llevar a cabo desde cualquier lugar de tu API, quizá incluso sin que el cliente tenga que recordar información de contexto. Y eso es BIEN porque incluso tu cliente se convierte en *stateless*. Esto es lo que [XXX](TODO!) tenía en mente cuando creó REST en su [tesis doctoral](TODO!).

Y por último: si añades un recurso *raíz* (mapeado a ```/```) con los links a los principales recursos de tu sistema ¡voilà! ya tienes un punto de entrada a partir del cual puedes ir tirando del hilo hasta llegar a todos los rincones de tu API, exactamente igual que haces con el ```index.html``` de un sitio web. Vale, vale: es posible que todavía estemos lejos de conseguir un cliente *universal* para APIs equivalente a lo que supone un navegador para una web. Pero los pasos que hacemos en esta dirección terminan facilitando el trabajo de todos.

Ok, ahora ya entiendes por qué hablamos de "Hypermedia as the Engine of Application State" y Martin Fowler te dirá que estás en el camino de alcanzar [el nirvana del REST](https://martinfowler.com/articles/richardsonMaturityModel.html).

## Estándares de representación

Como somos muy ingenieros nos encantan los estándares. Y como no podía ser de otra forma existen varios de ellos para HATEOAS que compiten entre sí. Puedes chafardear [Hydra](http://www.markus-lanthaler.com/hydra/) o [Siren](https://github.com/kevinswiber/siren) pero posiblemente el más popular de todos sea [Hypertext Application Language (HAL)](http://stateless.co/hal_specification.html). La verdad es que [la especificación formal de HAL](https://tools.ietf.org/html/draft-kelly-json-hal-08) es bastante legible y Spring Framework tiene un [soporte muy parcial](http://docs.spring.io/spring-hateoas/docs/0.23.0.RELEASE/reference/html/) para la misma.

Básicamente una respuesta HAL describiendo el curso de diseño de APIs REST sigue este esquema (que puedes ver también [aquí](TODO!) si te resulta más cómodo):

``` json
{
  "codigo": "apirest",
  "titulo": "Diseño de APIs",
  "unidadesDidacticasCompletadas": 2200,
  "_links" : {
    "curies": [
        { "name": "curso",
          "href": "http://docs.programar.cloud/relations/{rel}.html",
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
    "curso:inscribir" : { "href" : "/cursos/apirest/inscripciones",
                          "type" : "application/vnd.programarcloud.curso",
                          "title" : "Inscribirse" },
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

Primero explicita una serie de propiedades del objeto. Si estamos hablando de un curso podemos indicar el código, su título, etc.

A continuación vienen los ```_links``` que relacionan ese objeto con los siguientes estados a los que se sugiere poder saltar. En el caso de un curso podría incluirá enlaces para recuperar el siguiente y el anterior pero también el hipertexto que necesitamos para llevar a cabo una acción como puede ser inscribir a un estudiante en él.

Fíjate en que la clave que describe cada link indica su *relación*. El IANA ha creado una lista con [varias relacione estandarizadas para REST](http://www.iana.org/assignments/link-relations/link-relations.xhtml) pero también puedes inventar las tuyas propias. La única obligatoria es *self* que indique la url necesaria para recuperar el recurso actual. Otros atributos interesantes son el tipo para describir la estructura del objeto que se recuperará usando el enlace y que seguramente indicarás usando el [vendor tree](https://en.wikipedia.org/wiki/Media_type#Vendor_tree).

Hay un link especial, *curies*. Permite acortichar URIs para facilitar la documentación. Como te he dicho antes el IANA a creado una lista importante de acciones que más o menos se van a repetir en muchos tipos de aplicaciones pero está claro que no es suficiente: tu dominio particular de negocio necesitará algunas adicionales y tendrás que indicar dónde puede averiguarse en qué consisten.

Una posible solución consiste en usar el nombre de la acción como una URI: un identificador único que además puede leerse como una URL en la que dejar precisamente la documentación de la acción. Por ejemplo:

``` json
{
  ...
  "https://docs.programar.cloud/relations/inscribir.html" : { ... }
  ...
}
```

Pero claro, de esta manera terminamos con claves más largas que un día sin pan. En su lugar puedes definir un *curie* y aplicarlo como prefijo del nombre de la acción. El equivalente a un *namespace* de XML pero con un nombre mucho más trendy:

``` json
...
"curies": [
    { "name": "curso",
      "href": "http://docs.programar.cloud/relations/{rel}.html",
      "templated": true
    }
],
...
"curso:inscribir" : { "href" : "/cursos/apirest/inscripciones", ... },
...
```

Por último puedes evitar unos cuantos roadtrips entre el cliente y el servidor y añades en tu respuesta los datos que sabes que te van a pedir a continuación y para eso puedes utilizar la sección de *embeddeds*. Típicamente incluyes allí un resumen de los objetos asociados a la entidad que devuelves, en nuestro caso los profesores y las unidades didácticas. Échale un ojo con calma... si estás leyendo el blog con tu móvil quizá sea mejor que cargues [el fichero con el ejemplo en otra ventana](https://raw.githubusercontent.com/laravel/laravel/master/package.json).

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

## Implementaciones

Puedes encontrar un buen soporte para HATEOAS en algunas plataformas: [HATEOAS-Php](http://hateoas-php.org/) para Php y [Spring HATEOAS](http://projects.spring.io/spring-hateoas) para Java. En .Net y NodeJS no hay librerías que realmente se consideren la referencia (AFAIK!).

El soporte para HAL es incluso menor: [HAL-Php](https://github.com/blongden/hal) te puede ayudar si tu veneno es Php y Spring HATEOAS puede ser extendido con relativa facilidad para que te genere la mayor parte del código. No te pierdas este artículo sobre [cómo usar Spring HATEOAS](https://opencredo.com/hal-hypermedia-api-spring-hateoas/) para conocer más detalles si no puedes esperar a que publique el curso de desarrollo de APIs con Spring Boot.

¿Y los test? ¡Spring REST Docs for the win, por supuesto! Recuerda que ya tengo un {{% ilink "documentar-un-microservicio-con-spring-rest-docs" "post dedicado íntegramente a él"%}}.














.
