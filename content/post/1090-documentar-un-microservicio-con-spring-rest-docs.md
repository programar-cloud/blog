---
title: Cómo documentar un microservicio (SpringRESTdocs)
date: 2017-02-03T22:14:20+01:00
description: "Lo prometido es deuda: hoy te cuento una alternativa a Swagger para que generes una mejor documentación de tu API: Spring REST docs."
slug: como-documentar-un-microservicio-con-spring-rest-docs
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

episode : "15"
audio : "https://ia601502.us.archive.org/17/items/como-documentar-con-spring-rest-docs/como-documentar-con-spring-rest-docs.mp3"
media_bytes : "14786567"
media_duration : "21:28"
images : ["https://programar.cloud/media/1090-kindle-from-maxpixel.jpg"]
explicit : "no"

disqus_identifier: como-documentar-un-microservicio-con-spring-rest-docs
disqus_title: Cómo documentar un microservicio con Spring REST Docs
disqus_url: "https://programar.cloud/post/como-documentar-un-microservicio-con-spring-rest-docs"
---

{{% img src="/media/1090-kindle-from-maxpixel.jpg" alt="Documentación electrónica" %}}

*TL;DR: Genera documentación de forma casi automática, minimizando el repeat yourself casi a cero y estructurándola de forma que tenga sentido y coherencia. ¡Ah! Y llénala de ejemplos, maldita sea. Con Spring REST docs.*

{{% archive "como-documentar-con-spring-rest-docs" %}}

<!--more-->

## Desventajas de Swagger

Bueno, repasa si no lo tienes fresco {{%ilink "como-documentar-un-microservicio-con-swagger" "el capítulo sobre Swagger"%}}. Aunque es una herramienta que nos ha dado muchas alegrías a la hora de montar la documentación (sobre todo por lo divertido que es interactuar con el API) también está llena de limitaciones:

* Cuando defines la documentación puedes llegar a enterrar tu código en meta información. Por ejemplo, con SpringBoot tienes que ir sumando las anotaciones del MVC (que publican el servicio) y las de Swagger (que lo documentan). El código se vuelve difícil de leer.

* Aunque Swagger genera un json casi siempre se visualiza a través de la aplicación Swagger-UI y no resulta natural personalizarla... con lo que en el fondo si quieres añadir cualquier información adicional como por ejemplo las convenciones que sigue tu API tienes que crear un documento aparte, desconectado del principal.

* Swagger-ui se centra totalmente en las rutas HTTP que publica tu API en lugar de hacerlo en los recursos. Esto hace que aunque a primera vista sea fácil entender cómo se invoca una operación a la larga te va a costar más trabajo tener una visión global de los recursos que estás manipulando.

* La [especificación de Swagger](http://swagger.io/specification/) define una operación como la combinación de un verbo y una ruta... lo que hace que si quieres crear versiones distintas de la rutina que la implementa (por ejemplo, una que retorne json y otra que devuelva una imagen) tengas que implementar las dos dentro de la misma rutina haciendo que te sientas mala persona por ello. Y sobre todo ensuciando tu código.

Esto hace que, no te engañes, los usuarios de tu API se pongan a llorar en una esquina cuando no estás mirando. Y tú no quieres usuarios tristes, tu quieres programadores y desarrolladoras felices.

## Spring REST docs

Hace un par de años [Andy Wilkinson](https://twitter.com/ankinson) decidió que estaba cansado de todo esto y empezó un proyecto que terminó convirtiéndose en [Spring REST Docs](https://projects.spring.io/spring-restdocs/), que a partir de ahora llamaremos alegremente "SRESTD" porque inventar acrónimos es gratis.

Yo he llegado a él muy tarde, después de digievolucionar a *evangelist* y retirarme temporalmente del mundo del desarrollo. Así que al contrario que en otras ocasiones no voy a defender a capa y espada esta tecnología por muy buena que me parezca. Porque además para eso está el entrañable [Jorge Aguilera](https://twitter.com/jagedn), que sí la ha utilizado en proyectos reales y que puede ayudarnos con las dudas que vayan surgiendo ;-)

Pero ¿Por qué me gusta tanto? Porque Wilkinson tuvo un enfoque muy innovador: si al fin y al cabo los tests de nuestra aplicación determinan su comportamiento y por lo tanto son la prueba de que las cosas pasan como tienen que pasar ¿por qué no usarlos para generar la documentación?

> Tu escribes el test y Spring REST Docs se engancha a su ejecución y apunta todo lo que vaya sucediendo.

En otras palabras: tu escribes el test y Spring REST Docs se engancha a su ejecución y apunta todo lo que vaya sucediendo. Por ejemplo, toma nota de las rutas invocadas, de los parámetros utilizados, del cuerpo de la request, de las cabeceras usadas (incluyendo ```Accept```), del status retornado, de los datos enviados como respuesta, etc. Y los deja apuntados como *snippets*: pequeños ficheros que resumen precisamente cada uno de esos puntos y que después puedes incluir en un documento plantilla donde a ti te parezca.

{{% imgur "rdHaHOF" "Documentar el TODO es importante" %}}

A ver, que no te oigo gritar "Wow" y deberías estar haciéndolo. Te lo repito: cada vez que ejecutas tus tests ¡estás regenerando la documentación! Y si en algún momento el comportamiento de tus operaciones no siguen lo documentado lo sabrás, porque el maldito test va a fallar. Wow. Ahora sí.

El workflow queda así:

{{% imgur "Mmz39kv" "Spring REST Docs workflow" %}}

**Tu responsabilidades consisten en escribir los tests y la plantilla**. Los plugins de Maven se engancharán a la ejecución de los mismos para generar *snippets* con cada porción de información y una vez completado todo el proceso tomarán ese template y lo compilarán para tener el resultado final. Por ejemplo, échale un vistazo a este código que implementa un test. No te preocupes por los detalles: los explicaré en el curso paralelo sobre SpringBoot.

``` java
public class ActividadUnicoCursoCtrlIT {
...
  @Test
  public void getJson() throws Exception {
    String url = String.format(PATH, "cultura");
    this.mockMvc.perform(
        get(url).accept(MediaType.APPLICATION_JSON)
    ).andExpect(status().isOk())
     .andExpect(MockMvcResultMatchers.jsonPath("[*].codigoCurso",
      containsInAnyOrder("cultura","cultura","cultura")))
     .andDo(document("actividad-unico-curso-get-json",
  						responseFields(
        fieldWithPath("[0].codigoCurso").description("blah blah"),
        fieldWithPath("[0].numeroUnidadDidactica").description("bla blá"),
        fieldWithPath("[0].tituloUnidadDidactica").description("bla"),
        ...
        ))));
  }
}
...
```

Básicamente utilizo [MockMVC](http://docs.spring.io/spring-security/site/docs/current/reference/html/test-mockmvc.html) para simular la invocación del web service que permite recuperar las Actividades que se han realizado en las Unidades Didácticas de un Curso.Tras ello comprueba tanto que el status retornado es un código 200 como que el atributo *codigoCurso* de todos los objetos del json devuelto son iguales a "cultura". Tiene sentido ¿verdad? Si quieres tener más contexto sobre este modelo puedes releer el post que explicaba {{% ilink "arquitectura-del-primer-proyecto" "la arquitectura del proyecto" %}}.

Sí, sí, lo sé: las líneas tipo ```fieldWithPath("[0].codigoCurso").description("blah blah")``` te están doliendo porque al fin y al cabo la estructura del objeto que devolvemos está definida en una clase y no tendríamos por qué describir sus detalles aquí. Pero hablaremos de eso más abajo.

En cualquier caso una vez terminada la ejecución este test habrá generado una serie de *snippets* como el siguiente (que corresponde a la respuesta):

```
[source,http,options="nowrap"]
----
HTTP/1.1 200 OK
Content-Type: application/json;charset=UTF-8
Content-Length: 628

[ {
  "codigoCurso" : "cultura",
  "numeroUnidadDidactica" : "1000",
  "tituloUnidadDidactica" : "El nacimiento de los web services",
  "lecturasCompletadas" : 1080,
  "desde" : null,
  "hasta" : null
}, {
  "codigoCurso" : "cultura",
  "numeroUnidadDidactica" : "1010",
  "tituloUnidadDidactica" : "Desde monolíticas a microservicios",
  "lecturasCompletadas" : 1000,
  "desde" : null,
  "hasta" : null
}, {
  "codigoCurso" : "cultura",
  "numeroUnidadDidactica" : "1020",
  "tituloUnidadDidactica" : "Devops, no, en serio: devops",
  "lecturasCompletadas" : 500,
  "desde" : null,
  "hasta" : null
} ]
----
```

Y si en en el documento que sirve como plantilla para tu aplicación tienes unas líneas como las siguientes verás que al compilarse terminas obteniendo una bonita página HTML con el resultado de mezclar el texto literal con el contenido del *snippet*:

``` asciidoc
==== Estructura de la respuesta (application/json)

Cada objeto de la respuesta desnormaliza los atributos comunes (codigoCurso, numeroUnidadDidactica, tituloUnidadDidactica, desde y hasta) para facilitar su consumo en el cliente.

include::{snippets}/actividad-unico-curso/get-json/response-fields.adoc[]
```

La clave está en que puedes mezclar elementos generados automáticamente (el *snippet* incluído) con texto en formato libre que aclare lo que creas conveniente. En el caso de que no necesites información adicional puedes usar también una plantilla que te proporciona SRESTD para cada recurso.

Si no te suena la sintaxis de [AsciiDoc](http://www.methods.co.nz/asciidoc/)  lee [el tutorial que ha montado Jorge](http://jorge.aguilera.gitlab.io/tutoasciidoc/). En media hora te has hecho con ella seguro. Y a las malas SRESTD también soporta [Markdown](https://guides.github.com/features/mastering-markdown/).

En cualquier caso el resultado tiene una pinta tan estupenda como esta:

{{% imgur "6ZnkM3D" "Documentación que no hace llorar" %}}

Vale, que sí, que ya lo sé: que estoy cansino con Spring Framework y que quizá tú no quieras usarlo en tus proyectos. ¡Pero es que no hace falta! SRESTD se integra con [Rest Assured](https://github.com/rest-assured/rest-assured), un DSL que permite escribir test de integración para cualquier plataforma porque se limita a utilizar peticiones HTTP para invocar el endpoint correspondiente. Eso sí, perderás los extras que te cuento a continuación.

## Spring **auto** REST Docs

Una característica que forma parte del diseño de SRESTD es que utilizas los tests para describir los parámetro que se pasan o los resultados que se esperan y de esta manera compruebas que tengan el nombre correcto, por ejemplo. Pero esto va en claramente en contra de mi filosofía principal:

{{% imgur "w8DWxq6" "Desarrollo orientado a pereza" %}}

Soy un firme defensor de que la pereza en el caso de la programación es una virtud, no un defecto. Que te ayuda a escribir mejor código. Si quieres usar otra expresión para el mismo concepto aquí tienes una: [don't repeat yourself](https://es.wikipedia.org/wiki/No_te_repitas).

Hace unos párrafos te he dicho que solucionaríamos este punto, así que vamos a ello porque resulta que hace solo unos días (literalmente) [Jurag Misur](https://twitter.com/juraj_misur) y [Florian Benz](https://twitter.com/flbenz) han publicado el proyecto [Spring **Auto** REST Docs](https://github.com/ScaCap/spring-auto-restdocs) que elimina esa sobrecarga.

**Este proyecto utiliza introspección y análisis de código para extraer la información que tu API necesita** directamente del lugar en el que de forma más natural vas a codificarla.

Para empezar analiza tu código y utiliza el nombre de las clases y los métodos para crear la estructura de los *snippets*. En el ejemplo de hoy nuestro método [ActividadUnicoCursoCtrlIT:getHtml](https://github.com/programar-cloud/controlactividad/blob/1090/src/test/java/cloud/programar/lms/controlactividad/ActividadUnicoCursoCtrlIT.java#L136) generará una serie de *snippets* en la carpeta ```target/snippets/actividad-unico-curso/get-html```.

Además SARESTD revisa todas las anotaciones que ya estabas utilizando: las que utiliza [Spring MVC](https://docs.spring.io/spring/docs/current/spring-framework-reference/html/mvc.html)) y las [bean validation](http://beanvalidation.org/1.0/spec/) que puedes utilizar en tus clases de modelo para indicar (por ejemplo) que el valor mínimo de un campo es 100.

Pero lo que me parece más interesante es que ¡recupera la documentación de la javadoc! Básicamente en el workflow de tu proyecto tienes que añadir los plugins (Maven o Gradle) necesarios para que antes de procesarse el asciidoc se pueda analizar el código java y transformar los comentarios javadoc que hayas hecho en unos ficheros estructurados en json. El plugin de Spring Auto REST Docs se encargará de leerlos y añadirlos en los lugares que tú le marques. Con lo que por fin tienes un aliciente real para rellenar todos esos ```@param``` y ```@result```.

{{% imgur "ZFBAGeJ" "Calma que Maven lo hace todo" %}}

Así que el esquema general se complica un poco pero no le importa a nadie porque una vez que tienes configurado tu proyecto correctamente todo es transparente. Y adivina quién te deja un ejemplo con todo perfectamente colocadito: solo tienes que seguir los pasos que te pongo a continuación y abrir la dirección ```http://localhost:8080/docs/api-guide.html``` en tu navegador. Si la pereza te puede aquí tienes [una versión online](/1090-api-guide.html). Y sí, sí el gráfico del final está simulado porque no tenía ganas de integrar una librería de charting. Pero el resto no, palabrita.

``` bash
git clone https://github.com/programar-cloud/controlactividad
cd controlactividad
git checkout 1090
mvn install
cd target
java -jar controlactividad-0.0.4-SNAPSHOT.jar
```

Fíjate en cómo los parámetros de path y querystring quedan estupendamente documentados y cómo tienes ejemplos del resultado en json, HTML e imagen. Pero sobre todo fíjate en como puedes estructurar tu documentación como a ti te parezca más razonable, describiendo convenciones como qué semántica otorgas a PUT respecto a POST o cuándo vas a devolver una respuesta vacía o un estado 404. Sí, sí, amigo y amiga: tus usuarios van a ser fans, van a adorarte, van a construirte un monumento. No literalmente y quizá ni siquiera conscientemente, lo sé. Pero ¡van a utilizar tu API! Van a usar tu producto. Es lo mismo.

{{% imgur "0BGi2ke" "Tus usuarios aprendiendo tu API" %}}

## Limitaciones y Afterparty

A día de hoy (Febrero de 2017) parece que el plugin que realiza el análisis de tu ```javadoc``` para generar la estructura json utilizada por SARESTD no codifica correctamente el fichero en UTF-8 y esto hace que no puedas usar símbolos exóticos como acentos o "Ñ"s en tus comentarios. Ni falta que hace, porque recuerdas que hay que utilizar siempre el inglés en tus proyectos y que yo uso el español solo para hacerte más fácil distinguir el código propio del que usa el framework.

Por otro lado quizá estés pensando que necesitas inspiración. Si es así no te cortes y revisa la [documentación del API de GitHub](https://developer.github.com/v3). Es pura lírica. Casi.

Vale, ahora sí que ya te he contado todo lo que quería. Y perdona el retraso pero tengo varios frentes abiertos y por momentos en algunos estoy cediendo terreno (aunque contraatacaré). Me he resistido a hacerlo pero al final está claro que no puedo mantener la periodicidad semanal así que durante un par de meses tengo que suspender el SLA del blog. Intentaré publicar cada dos semanas. Échame de menos.

jv

pd: [Marcus](https://soundcloud.com/musicbymarcus) se encarga como siempre de la música del podcast. Porque nos hace sonreír. La bonita foto del post la ceden como CC0 [los chiquitos de MaxPixel](http://maxpixel.freegreatpicture.com/Kindle-Device-Glasses-Paper-White-E-book-Book-785682). Kudos to them.

ppd: En serio, sigue a [Jorge Aguilera](https://twitter.com/jagedn) en Twitter porque además de ser súper majo siempre anda metido en temas interesante. Desarrolla con Groovy, no te digo más.

pppd: Estaré por la [Spring.IO 2017](http://2017.springio.net/) que se celebra en Barcelona el próximo mayo (2017). En algún momento te cuento más cosas sobre este evento pero si tienes pensado pasar por allí asegúrate de buscar al tipo calvo y atractivo que escribe este blog. Intentaremos conseguir cerveza.

pppppd: Acuérdate de que compartir es amar y que publicando la dirección del blog o del podcast en tus redes sociales haces que llegue a más gente. En este punto no me vale lo de la pereza ;-)

ppppppd: Como siempre si tienes dudas, preguntas o encuentras errores de ortografía usa los comentarios. O directamente crea un PR del [repositorio en el que guardo el blog](http://github.com/programar-cloud/blog).
