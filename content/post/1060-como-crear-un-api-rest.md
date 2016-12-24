---
title: Cómo crear un API rest
date: 2016-12-18T15:45:20+02:00
description: "Vamos a diseñar el API de nuestro microservicio basándonos en REST."
slug: como-crear-un-api-rest
draft: false
tags:
- diseño
- arquitectura
- rest
- programación
- java
- springboot
temas:
- Proyecto
niveles:
- Intermedio

episode : "12"
audio : "https://ia601505.us.archive.org/2/items/como-crear-un-api-rest/como-crear-un-api-rest.mp3"
media_bytes : "27620291"
media_duration : "33:37"
images : ["https://programar.cloud/post/como-crear-un-api-rest"]
explicit : "no"


disqus_identifier: como-crear-un-api-rest
disqus_title: Cómo crear un API rest
disqus_url: "https://programar.cloud/post/como-crear-un-api-rest"
---

{{% img src="/media/banco_bengallagher.jpg" alt="un banco en el parque" %}}

*TL:DR; Diseña un API de la misma manera que diseñas una pantalla: pensando en la comodidad de quien la va a utilizar, no en tu conveniencia.*

{{% archive "como-crear-un-api-rest" %}}

Vamos a ponernos el gorrito de un miembro del equipo, en concreto la persona que se haya asignado la tarea de implementar la historia de usuario PROGRESO_CURSOS. ¿La recuerdas del {{% ilink "arquitectura-del-primer-proyecto" "post anterior"%}}? Decía algo así:

* Como **administrador de cursos** deseo poder **obtener una visualización global** de la utilización de cada curso y unidad didáctica para **conocer su popularidad** y actuar en consecuencia.*

Bien, manos a la obra: tendremos que detectar los recursos a manipular, definir unas rutas HTTP claras para invocar operaciones sobre ellos y generar la respuesta deseada. No problem. O sí.<!--more-->

¡Ojo! Para que no haya confusiones entre el rol ágil de [product owner](https://proyectosagiles.org/cliente-product-owner/) y el cargo que ostenta el cliente para el que desarrollamos la aplicación (descrito también como *propietaro del producto* originalmente pero que no siempre tiene por qué coincidir) he cambido el nombre de este último a un mucho más lógico *administrador de cursos*. Mil perdones, esta noche me pego unos latigazos. Umh... Vale, ya podemos seguir.

{{% imgur "NjZeDKB" "Fundada en 1880"%}}

## Los recursos

En la Wikipedia tienes una [buena descripción sobre REST](//wikipedia/https://es.wikipedia.org/wiki/Transferencia_de_Estado_Representacional), no voy a  repetirte lo que hay allí: mi plan es ir contándote los detalles que hagan falta en el momento en el que los necesites, no adelantarlos todos para después aplicarlos. Es como a mi me gusta aprender. Pero si prefieres hacerte una idea de lo que vamos a hablar antes de seguir no te cortes y visita el link antes de continuar leyendo. Tampoco te preocupes si tu programación está un poco oxidada, verás que no hago mucho incapié en ese aspecto en este post.

Lo primero que tenemos que tener claro es que REST se estructura alrededor de **recursos**, las entidades que permites manipular. Esas entidades deben quedar representadas en la URL (la ruta) que se utiliza para ejecutar operaciones sobre ellas. Así que el primer paso es definir la lista de recursos y para ello vamos a echar un vistazo a la historia de usuario.

El *administrador de cursos*, claramente, es un actor involucrado que en el fondo corresponderá a un tipo de *usuario*. No va a tener un papel relevante más allá de la autorización: qué operaciones puede invocar y a qué información tiene acceso. Así que de momento aparcamos su implementación. Esto generará una nueva tarea que consistirá en integrar el sistema de permisos en la funcionalidad que implementos ahora mismo pero ya la llevaremos a cabo más tarde. Lo comentamos con el resto del equipo, apuntan la nueva tarea y pasamos al siguiente paso.

> Fíjate en algo importante: hemos pedido una aclaración. Qué loco. Durante el desarrollo.

Seguimos revisando la historia de usuario. ¡Encontramos otro sustantivo: *curso*! Claramente aquí tenemos nuestro primer recurso. Preguntamos al product owner y nos comenta que un curso básicamente ahora mismo está definido por un código alfanumérico único e inmutable, un título en español, una descripción de unas 100 palabras y una serie de unidades didácticas. Fíjate en algo importante: hemos pedido una aclaración. Qué loco. Durante el desarrollo. Más te vale que sea posible llevar a cabo esta acción de la manera más eficiente posible si no quieres acabar como yo {{% ilink "devops-en-serio" "en ese horrible proyecto"%}}.

De la historias de usuario y de la última conversación detectamos que existe otro recurso llamado *unidad didáctica*. De nuevo el product owner nos explica que cada una de ellas tiene un número de orden (no consecutivo e inmutable) y un título. Usando el código es posible generar el link al post que en el fondo la implementa.

El product owner nos dice que simplemente quiere saber cuánta gente ha participado activamente en cada uno de los cursos y en cada una de las unidades didácticas y que ello puede saberse contando cuántas personas han cambiado el estado de una unidad a "completado".

Así que ya tenemos nuestra lista inicial de recursos: *curso* y *unidad-didactica*. Además hay una relación jerárquica clarísima entre ellos: un curso está compuesto de unidades didácticas. Compartimos esta información con el resto del equipo que no ha estado presente en la conversación porque está claro que les hará falta y no queremos que nuestro product owner nos odie más de lo imprescindible por preguntarle diez veces lo mismo.

## Las operaciones

¡Son consultas, está bastante claro! En concreto confirmamos con el product owner que está interesado en poder visualizar datos del número de estudiantes que han participado en cada curso y también quiere ver el número de estudiantes que han participado en cada lección de un curso concreto entre un rango de fechas determinado.

La aclaración no es muy diferente de lo que nos había comentado en la reunión de planificación así que decidimos que podemos implementarlo. Pero no tiene por qué ser así: si el trabajo de planficación fue pobre y fallamos en describir correctamente la tarea resulta imposible estimar su duración correctamente. **En ese caso la mejor opción es siempre crear nuevas tareas con los detalles extra que no se puedan asumir en este sprint y dejarlos pendientes para el siguiente**. 

Si implementar el filtro hubiese supuesto mucho trabajo eso es exactamente lo que habríamos hecho. Y ¿sabes una cosa que a mi me sigue costando pero que poco a poco voy aprendiendo? Sí, exacto: a decir NO. Y es crítico hacerlo cuando estás en este tipo de desarrollo y se propone un cambio de funcionalides importante porque te has comprometido a muy corto plazo para completar una serie de tareas. Si tienes problemas enfrentándote a las peticiones del product owner, avisa al scrum master: sus responsabilidades incluyen además de hacer cafés el mantener la dinámica del sprint y (si es necesario) controlar las peticiones del product owner.

{{% imgur "dSwTHIA" "grumpy cat dice NO." %}}

Bien, volvamos a las operaciones. Vamos a definir rutas que tengan cierta semántica y utilizaremos el plural para representar el recurso (en serio, hazlo, todo queda más natural). Recuerda (por lo que has leído en la Wikipedia) que en REST nos vamos a esforzar en utilizar la semántica original del protocolo HTTP para describir qué queremos hacer sobre esos recursos. Si repasas la [RFC de HTTP](https://tools.ietf.org/html/rfc2616#page-36) (no, en serio, hazlo, que es súper legible y sencilla) verás que para obtener un documento debe usarse el método ```GET```. También vamos a tomar la convención de que si una parte de la ruta es variable (para especificar un subconjunto del total de recursos) colocaremos su identificador entre llaves. Digamos que definimos estas operaciones:

* ```GET /cursos``` 
* ```GET /cursos/{codigo}/unidades-didacticas```

La primera nos retornará la información de todos los cursos y la segunda información sobre las unidades didácticas de un curso concreto. Un ejemplo de la segunda URL en la que se ha aplicado un valor a la parte variable sería: 

* ```/cursos/introduccion/unidades-didacticas``` 

indicando que quieres conocer los datos de las unidades didácticas del curso con el código *introduccion*. Así que ¿qué te parece esta primera aproximación?

Exacto: posiblemente nos hemos venido arriba. La primera ruta representa todos los cursos con lo que semánticamente sería perfectamente aceptable devolver todos los datos asociados a los mismos. Esto incluiría el número de alumnos inscritos pero también la descripción. Y este último atributo nos supone una sobrecarga de unos 500 bytes por cada uno de los cursos que **no vamos a utilizar para solucionar este caso de negocio**. Este es el criterio importante: **cómo se adapta nuestra operación a la query que necesitamos responder** por lo que decidimos que este diseño supone demasiado sobrepeso en el documento de respuesta y tenemos que buscar una solución alternativa.

> Este es el criterio importante (cómo se adapta nuestra operación a la query que necesitamos responder).

Hay dos opciones. La primera sería añadir un mecanismo por el cual podamos especificar en la URL una *proyección*, que es una forma elegante de decir que solo quieres parte de la información disponible en cada momento. Esta opción la implementaríamos con parámetros en la [querystring](https://es.wikipedia.org/wiki/Query_string) de la URL. O bien también puedes crear un nuevo recurso dependiente del anterior que solo incluya la información que necesitamos. Calma, ahora te enseño dos ejemplos:

* ```GET /cursos?proyeccion=titulo,actividad```
* ```GET /cursos/actividad```

¿Qué te parece mejor? Pues esa es la decisión correcta. En mi caso creo que la segunda opción se entiende mejor, es más legible sobre todo si más adelante tenemos que utilizar la querystring para alguna otra cosa. Y seguramente también tiene una semántica más fuerte. Así que optamos por ella. **Pero no deja de ser una decisión de diseño, defiéndola como tal**. Por coherencia seguimos la misma táctica con las unidades didácticas. Y nuestro API queda así:

* ```GET /cursos/actividad```
* ```GET /cursos/{codigo}/unidades-didacticas/actividad```

Bien, perfecto. Funcionará. Ahora tenemos que solucionar el *extra* del que hemos hablado antes: el poder filtrar entre un rango de fechas. Y aquí sí es muy cómodo y natural ampliar la información que proporcionamos en forma de querystring, como parámetros opcionales. Por ejemplo:

* ```GET /cursos/actividad?desde={fechaInicial}&hasta={fechaFinal}```

El formato para especificar fechas más popular es el de [ISO-8601](https://es.wikipedia.org/wiki/ISO_8601). Y vigila, porque ya sabes que en informática las fechas tienen siempre más peligro que una piraña en un bidé: almacena el dato siempre en UTC y solo cuando dibujes pantallas preséntalo en el formato local del usuario. O tendrás poblemas. Serios. 

Básicamente la UTC (Coordinated Universal Time acronimizado por alguien que llevaba dos cervezas de más) se determina a partir de las oscilaciones de más de 70 relojes atómicos y es en el fondo el valor reconocido internacionalmente como *fecha actual* independientemente de la zona horaria en la que te encuentres. Bien, filtro solucionado.

Un inciso ¿tendría sentido una ruta de este estilo? 

* ```/cursos/{codigo-curso}/unidades-didacticas/{numero-ul}/actividad```

Probablemente no: el resultado sería simplemente un número con el número de unidades didácticas completadas y estarías pagando toda la latencia de una petición/respuesta para conseguir una información demasiado precisa. Tardarías lo mismo (o casi) en retornar todos los datos de la unidad didactica que seleccionases (código, título, actividad, etc) y además con toda seguridad ese sería el caso de uso real de la operación: manipular la ficha entera de una unidad didáctica, no solo conocer los estudiantes que la han completado. La ruta quedaría sin el recurso final:

* ```/cursos/{codigo-curso}/unidades-didacticas/{numero-ul}```

Si te parece complicado, **piensa en pantallas para humanos**: posiblemente crearías una para visualizar la ficha de una unidad didáctica pero no para presentar tan solo la actividad que ha recibido. 

> La mejor manera de incrementar tu productividad es no hacer lo que nadie ha pedido.

Pero recuerda que nadie nos ha pedido esta funcionalidad y que la mejor manera de incrementar tu productividad es no hacer lo que nadie ha pedido.

## Las respuestas

Una vez solucionado el cómo invocamos la operación tenemos que decidir el formato en el que responderemos. Y sé lo que esperas: esperas que te diga que XML es muerte y hay que usar JSON. **Y lo cierto es que XML es muerte** pero si tu usuario (¡el consumidor del API!) trabaja con XML es tu responsabilidad darle esa opción: que sea él quien con por ejemplo la cabecera ```Accept``` de HTTP te indique qué prefiere. La enorme mayoría de frameworks del mundo permiten generar los dos formatos automáticamente así que ante todo mucha calma. 

Por cierto, una cabecera HTTP es... no, espera, mejor dame unos días y preparo un vídeo para enseñarte cómo funciona HTTP si nunca te has puesto a jugar con él a bajo nivel. Lo que te enseño ahora es un ejemplo del posible resultado para ambas APIs para la petición ```/cursos/actividad?desde=2016-11-01T00:00:00-00:00&hasta=2000-10-31T23:59:59-00:00```

```json
[
  {
    "codigo": "cultura",
    "titulo": "Cultura DevOps",
    "unidadesDidacticasCompletadas": 2580,
    "desde": "2016-11-01T00:00:00Z",
    "hasta": "2000-10-31T23:59:59Z"
  },
  {
    "codigo": "apirest",
    "titulo": "Diseño de APIs",
    "unidadesDidacticasCompletadas": 2200,
    "desde": "2016-11-01T00:00:00Z",
    "hasta": "2000-10-31T23:59:59Z"
  },
  {
    "codigo": "spoiler",
    "titulo": "No way",
    "unidadesDidacticasCompletadas": 0,
    "desde": "2016-11-01T00:00:00Z",
    "hasta": "2000-10-31T23:59:59Z"
  }
]
```

El hecho de repetir el rango de fechas para cada curso es una decisión de diseño, de nuevo. El objetivo es facilitar la vida al desarrollador que utilice el API al devolverle objetos muy simples como respuestas en lugar de obligarle a crear una composición en la que un objeto *Curso* contenga instancias de tipo *Actividad*.

> Una vez hayamos publicado esta versión del API estamos firmando un contrato: no vamos a poder cambiar el nombre y el tipo de ninguno de sus atributos.

Y sobre todo recuerda que una vez hayamos publicado esta versión del API estamos firmando un contrato: no vamos a poder cambiar el nombre y el tipo de ninguno de sus atributos. Añadir nueva información puede ser aceptable pero a menos que quieras mantener varios proyectos que implementen distintas versiones del web service (ya te contaré cómo hacerlo si resulta inevitable) los nombres y tipos que hayas decidido aquí están para quedarse. Y si no me crees echa un vistazo a la cantidad de atributos repetidos (con distinto formato) en un tuit cualquiera. Por ejemplo, la propiedad *geo* está duplicada en *place* (en distintos formatos) y debería ir asociada a *location*. Pero los chiquitos que crearon el contrato se han portado bien y han resistido el impulso de refactorizarlo.

{{% imgur "a96YFyM" "anatomía de un tuit, por raffi krikorian" %}}

{{% activity %}}
Pero ¿se te ocurre otro par de formatos que podrían ser útiles en nuestro caso? Venga, para un momento piensa un poco en ello. Luego sigue leyendo.
{{% /activity %}}

Yeeeeees. Estamos hablando de números, estadísticas. Y el product owner nos ha dicho que quiere dibujarlos, representarlos. Así que ¿por qué no ofreces la posibilidad de pedir un dibujo? Ya sabes, image/png, image/jpg... lo que sea. No es tan difícil, de nuevo tienes una lista enorme de librerías que te ayudan. De esta manera le estás facilitando enormente el trabajo de hacer una primera integración entre su producto y tu API.

Y por otro lado si hay número de por medio una forma muy potente de añadir todo tipo de funcionalidades a tu aplicación es dejando que el usuario final (el profesor, en este caso) la implemente. En forma de hoja de cálculo, por ejemplo. Hagamos que nuestro web service sea también capaz de retornar ficheros tipo *text/csv* y que los magos de las rejillas monten sus historias sin tener que pedirnos ayuda.

{{% imgur "8QUoZGQ" "excel magic" %}}

Como ahora mismo tú eres mi usuario y quiero que puedas jugar rápidamente con el microservicio he añadido también el código necesario para que te responda si invocas la url desde el navegador. En el fondo se trata simplemente de aceptar también *text/html* como un posible formato de respuesta. **Técnica y estéticamente impecable, que no te vengan con historias de que un web service solo debe retornar JSON**.

El mismo razonamiento puedes hacer a la hora de *recibir* información en la petición. En nuestro caso no ha hecho falta pero mientras más flexibilidad aportes, mejor. Aunque reconozco que muchas veces es más costosa de implementar esta parte así que si tú también terminas llegando a un compromiso no te sientas demasiado mal.

## La implementación

En este post no voy a dar muchos detalles sobre ella, no es el objetivo que tengo aquí. En cuanto pueda montaré una serie de entradas especiales centradas específicamente en el desarrollo y como ya escuchaste en {{% ilink "arquitectura-del-primer-proyecto" "el capítulo anterior" %}} se basará en [Spring Boot](https://projects.spring.io/spring-boot/): este framework me tiene el corazón robado, bribón.

Aquí tienes [el repositorio de código fuente](https://github.com/ciberado/controlactividad) y en este otro link encontrarás [el ejecutable ya compilado](https://github.com/ciberado/controlactividad/releases/download/como-crear-un-api-rest/controlactividad-0.0.1-SNAPSHOT.jar). Elige el camino con el que estés más cómodo para probarlo pero seguramente este último te será más sencillo si no has programado antes en java: solo tienes que instalar [el kit de desarollo](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html) y desde línea de comando: 

```bash
cd <carpeta_en_la_que_tienes_el_jar>
java -jar controlactividad-0.0.1-SNAPSHOT.jar
```

Aparecerán unos bonitos mensajes (incluyendo el aviso de que el servidor de aplicaciones está listo para recibir peticiones) y dado que son consultas y por lo tanto utilizan el método GET de HTTP puedes probarlas desde tu navegador: 

```http://localhost:8080/cursos/actividad?desde=2016-11-01T00:00:00-00:00&hasta=2000-10-31T23:59:59-00:00```

```http://localhost:8080/cursos/introduccion/actividad```

Verás también que si cambias los parámetros ¡obtienes exactamente el mismo resultado! Eso es porque solo está implementada la capa del Controlador, es decir, la que permite interaccionar con el exterior de la aplicación y que es la que define el API. Las reglas de negocio, la base de datos y el resto de componentes están simulados y nos dedicaremos a ellas más adelante. Es más, si pruebas la segunda dirección a fecha de hoy no te funcionará porque la he implementado todavía: no aporta mucho a lo que ya hemos explicado.

Querrás comprobar también si los otros formatos de respuesta funcionan y para eso tienes que ser capaz de enviar cabeceras HTTP. Desde el navegador puedes hacerlo con extensiones como el súper conocido [Postman para Chrome](https://chrome.google.com/webstore/detail/postman/fhbjgbiflinjbdggehcddcbncdddomop) o el [Rest-easy para Firefox](https://addons.mozilla.org/es/firefox/addon/rest-easy/). En el vídeo en el que te hablaré de HTTP te enseño a usarlos. Si (como yo) eres un romántico o una romántica en realidad terminarás usando [the good old cUrl](https://curl.haxx.se/download.html).

## En el siguiente capítulo

Recuerda: tengo un plan. Y el plan incluye empezar a hablar sobre tests tan rápido como sea posible porque son la única manera de asegurar la calidad de tu código. Nos dedicaremos a ello la semana que viene mientras gestionamos los posibles errores del API y alguna operación adicional. También hablaremos de documentación automática, algo crítico a la hora de facilitar la vida a tus usuarios. Y de HATEOAS y paginación. No, eso no va a caber. Lo dejaremos para la siguiente entrega. Pero ¡seguiremos implementando nuestro microservicio!

¡Ah! Y si no tienes clara alguna de las ideas que han ido saliendo (por ejemplo qué es JSON), dímelo. Tengo un plan, pero si no te gusta aquí tengo otros ;-)

jv

pd: ¿Adivinas de quién es la música de la entradilla? Yes, de [Marcus](https://soundcloud.com/musicbymarcus/promo-music-inspiational). No me digas que no sonríes cuando la oyes.

ppd: La imagen del post ilustra perfectamente lo que quiero hacer una vez pase la próxima semana y es de [Ben GAllager](bengallagher).

pppd: Como casi siempre te dejo una tira de Dilbert. Por cierto, [la de esta semana](http://dilbert.com/strip/2016-12-12) es espectacular.

ppppd: Simon Fodden escribió hace tiempo una interesante artículo sobre [la anatomía de un tuit](http://www.slaw.ca/2011/11/17/the-anatomy-of-a-tweet-metadata-on-twitter/) utilizando para ello el gráfico que has visto antes de [Raffi Krikorian](https://twitter.com/raffi).



