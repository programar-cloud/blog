---
title: Tests de integración
date: 2017-01-05T08:14:20+02:00
description: "Es imposible mantener la velocidad de despliegue si los errores no se detectan inmediatamente y tu herramienta para hacerlo es testear."
slug: tests-de-integracion
draft: false
tags:
- arquitectura
- programación
- java
- springboot
- testing
temas:
- API
niveles:
- Intermedio

episode : "13"
audio : "https://ia801500.us.archive.org/11/items/tests-de-integracion/tests-de-integracion.mp3"
media_bytes : "25133178"
media_duration : "29:07"
images : ["https://programar.cloud/media/1070-traffic-light-tree-william-warby.jpg"]
explicit : "no"

disqus_identifier: tests-de-integracion
disqus_title: Tests de integración
disqus_url: "https://programar.cloud/post/tests-de-integracion"
---

{{% img src="/media/1070-traffic-light-tree-william-warby.jpg" alt="traffic light tree" %}}


*TL;DR: Es imposible mantener la calidad del producto si los errores no se detectan inmediatamente. Una de las herramientas más potentes que tienes son los tests.*

{{% archive "tests-de-integracion" %}}

Voy a decirte por primera vez algo: no, no, en realidad llevo dándote la paliza con lo mismo desde el primer post y es que **el código tiene que estar en producción para que aporte valor**. Y el problema principal que te vas a encontrar si en lugar de una release al mes haces cuatro (o diez, o cien) es que tienes cuatro, diez o cien veces más oportunidades de liarla. Cualquier error que hayas introducido en tu código potencialmente puede terminar impactando al usuario mucho antes y provocar un retraso en cascada de nuevos despliegues. Voy a explicarte cómo evitar esta situación y de paso también te contaré algunas cosas sobre las lechugas.<!--more-->

## Las restricciones de cualquier proyecto

Un proyecto siempre tiene condicionantes que puedes visualizar como un triángulo formado con: la fecha en la que una release  tiene que estar funcionando, las características implementadas en el mismo y el coste (pasta, money, guita, cash, billetes verdes, presidentes muertos) que este objetivo tiene asignado. Puede que detectes que una de estas variables no va a cumplirse, por ejemplo que la entrega no estará disponible en la fecha que se había decidido. Bueno, en ese caso siempre puedes intentar jugar con las otras dos para recuperar terreno: puedes renegociar a la baja las funcionalidades que implementarás o puedes añadir más personas al proyecto o alargar las horas de trabajo y confiar en que por una vez esa decisión va a traducirse en un incremento de la productividad por jornada.

{{% img src="/media/1070-esquema.png" alt="triangulo restricciones" %}}

¿A qué viene esto? A que en ocasiones estas variables se dibujan como un cuadrilátero en lugar de un triángulo porque existe un cuarto lado: la calidad. **Pero es muy estúpido tomar la decisión de reducir voluntariamente este último factor** y ya sabes que al escoger ese camino tu cliente pierde la confianza y que en el fondo lo único que estás generando es una bola de nieve. Ahora llamamos a esa bola de nieve [deuda técnica](https://es.wikipedia.org/wiki/Deuda_t%C3%A9cnica) pero es lo que habitualmente hemos conocido con el término *chapuza*. No vamos a permitirlo.

{{% imgur "krK8XXy" "you know what I mean" %}}

Entiéndeme, el nivel de chapucería de tu código tiende a crecer de forma natural: forma parte de la entropía del universo. Esto se entiende muy fácilmente porque la cantidad de cosas que puedes implementar con tu lenguaje de programación favorito es infinita y en cambio el estado al que quieres llegar (lo que quieres que tu programa haga) está mucho más acotado. Lo único que puedes hacer es detectar tan rápido como puedas que te has salido de ese estado y reconducirlo.

> Una vez que el código está desplegado en producción necesitarás tener una muy buena monitorización.

Para conseguirlo una vez que el código está desplegado en producción necesitarás tener una muy buena monitorización y automatizar todo lo posible las reacciones para arreglar los problemas que vayan apareciendo. Eso es algo que desde el punto de vista del equipo de desarrollo ha quedado siempre muy lejos, cuando no directamente nos hemos desentendido porque no lo considerábamos parte de nuestro trabajo. Ya veremos en otro post que aunque la gente de operaciones será la que aporte más valor en ese momento es en la implementación de la aplicación donde empieza este trabajo. No voy a decir la palabra. Pero sabes que estoy pensando en ella y tú también.

{{% youtube tiFWZo99uoI%}}

Aún así, si el error ha llegado hasta los usuarios el impacto puede ser potencialmente importante o incluso catastrófico. Ya sabes: caras largas, vergüenza extrema y dinero esfumado. Tenemos que minimizar las probabilidades de que esa situación se presente y para ello es **imprescindible** (pero **imprescindible**) diseñar y aplicar una estrategia de pruebas a tu código.

## Quién le pone el cascabel al necromorfo

Puedes hacerlo a mano. En serio. Hace poco me comentaron que el control de calidad que se iba a aplicar a un proyecto realmente grande se basaba en contratar a un ejército de indios para que siguiesen unos cuantos centenares de procesos escritos en hojas de papel y confirmasen que el resultado era el esperado. Quién sabe. Puede que les funcione. Aparentemente ese ejército de personas que no tienen ningún contexto sobre lo que están haciendo y no son capaces de describir la causa de los problemas que encuentran (mucho menos de aplicar soluciones) sale relativamente barato a final de mes. 1300 millones de seres humanos viviendo en un subcontinente y en lugar de contratar a los mejores talentos esta empresa se ha dedicado a buscar a los que salen más baratos.

¿Sabes lo que no sale barato en cualquier caso? El tiempo que el equipo de desarrollo va a tener que esperar para tener esa información, analizarla sin más datos que los proporcionados en la hoja de proceso y desarrollar el fix correspondiente. Y luego repetir el proceso. Las veces que haga falta. Buena suerte con ello. Total solo llevaban un par de décadas acumuladas en el desarrollo.

> La responsabilidad principal sobre las pruebas de un proyecto debe de recaer en su equipo de desarrollo.

Y es que no te engañes: está genial tener un departamento de QA si tienes presupuesto para mantenerlo pero **la responsabilidad principal sobre las pruebas de un proyecto debe de recaer en su equipo de desarrollo**. Y precisamente es para evitar lo que te he contado y conseguir que tan rápido como se detecten los problemas las personas que tienen el contexto necesario para analizarlos y corregirlos puedan ponerse manos a la obra.

Pero obviamente el equipo de devels tienen otros cosas que hacer que seguir hojas procedimentales para probar manualmente la aplicación. No sé, cosas como desarrollar y tal. De manera que vas a tener que automatizar los tests para conseguir que no estorben. Y en el fondo es la misma diferencia que encontrarás entre cultivar lechugas con robots o hacerlo de forma tradicional: o echas las ganas al principio o las pones para siempre. Los japos piensan fabricar 500.000 lechugas al día con el primer sistema automatizado de producción de lechugas y adivina [quiénes van a verse afectados por ello](http://www.grupomsc.com/espana-el-mayor-productor-de-lechugas-en-2015/). Amigo, amiga: no quieres ser la lechuga. Quieres trabajar con el robot que hace lechugas.

Venga, una batallita: conocí hace años a una programadora que me contó que su marido llevaba semanas llegando a casa a las once de la noche. Sé lo que estáis pensando. Pero no. Que no, en serio: el chiquito era también programador y estaba contratado en un banco de tamaño mediano. Su trabajo, a partir de las seis de la tarde, consistía básicamente en mirar pantallas mientras una serie de tests se ejecutaban sobre la aplicación que estaban desarrollando. Y claro, era a las seis porque a esa hora los desarrolladores dejaban de añadir código y por lo tanto no cambiaban el comportamiento después de que el pobre chaval hubiese ejecutado el programa de pruebas asociado. Tardaba cuatro horas en completar el trabajo y después todavía tenía que arrastrarse hasta la estación de tren y cogerlo para llegar a casa.

> Los programadores no sentían como algo propio la responsabilidad de testear sistemáticamente la aplicación.

Fíjate en la gran cantidad de cosas que se pueden hacer rematadamente mal en un párrafo tan pequeño. Para empezar no existía control de versiones y había que congelar el desarrollo para hacer las pruebas. O mejor dicho, congelar las pruebas hasta que desarrollo se fuese a casa. Y **los programadores no sentían como algo propio la responsabilidad de testear sistemáticamente la aplicación si no que lo delegaban en otra personita, con el impacto psicológico que esto tiene en cómo se hacen las cosas**. Pero lo más increíble es que aunque tenían programados los tests al final no se lanzaban sin intervención humana y no generaban un informe automáticamente: terminaba todo dependiendo de un par de ojos pendientes de la pantalla que confirmaban que todo estaba ok. De unos ojos muy cansados, mucho. Conectados a un cerebro que probablemente no dejaría de preguntarse qué estaba haciendo con su vida.

Recordad, soy devel. Sé lo que piensas la primera vez que alguien nos dice  "¿dónde están los tests?". Esa primera vez solemos contestar "no tengo tiempo de escribir tests". Cuando lo cierto es que escribir tests es nuestro [fraking](https://youtu.be/r7KcpgQKo2I?t=22s) trabajo, es nuestra responsabilidad. Y es verdad, en un mundo perfectamente esférico muchos tests estarían escritos por las personas que mejor conocen el comportamiento de la aplicación (la gente de negocio, los usuarios finales, quienes sea) pero no estamos en un mundo de [vacas esféricas](http://ingenieriasimple.com/blog/blog/2010/01/05/el-chiste-del-ingeniero-el-fisico-y-el-matematico/). Ellos no van a escribir tests y como les intentes explicar lo naturalmente expresivo que es [cucumber](https://cucumber.io/) van a terminar llamando a seguridad. Así que por motivos prácticos los que harán ese trabajo son los que saben programar y en concreto aquellos que pueden aprovechar más rápidamente esos informes de error para corregir el código. Me vas pillando: el equipo de desarrollo lleva casi todas las papeletas para el sorteo.  Y sí, sí, mete también un equipo especializado en QA si te llega la pasta. Pero como algo complementario.

> Un 10% de código comprobado es infinitamente mejor que un 0%, sobre todo si te centras en la parte que resulta más problemática y si te encargas de testear funcionalidad y no líneas de código.

Y deja de llorar porque escribir tests es divertido y ejecutarlos aún más. No hagas caso de los talibanes de la cobertura: vas a leer que si el porcentaje de tu código que la batería de tests comprueba está por debajo del 80% no lo estás haciendo bien. Y eso no tiene ningún sentido: en muchos lenguajes de programación el porcentaje de código puramente técnico que no aporta gran valor es muy alto (estoy mirándote a ti, Java) y probarlo es desperdiciar esfuerzo. Por ejemplo, si inicializas un objeto a través de su constructor es posible que no necesites utilizar las operaciones *set*. Lo realmente importante es que cuando llevas meses o años desarrollando un proyecto sin haber creado una estrategia de testeo marcarte un objetivo tan ambicioso como ese solo sirve para desanimarte. **Un 10% de código comprobado es infinitamente mejor que un 0%, sobre todo si te centras en la parte que resulta más problemática y si te encargas de testear funcionalidad y no líneas de código**.

Un pequeño disclaimer: si quieres hacer [TDD](https://es.wikipedia.org/wiki/Desarrollo_guiado_por_pruebas) (utilizar los tests como una forma de guiar tu desarrollo) no soy tu hombre. Lo intenté un par de veces y la experiencia no me convenció aunque estoy totalmente seguro de que se debe a carencias formativas propias. Si tú has tenido experiencia en este campo estaría genial que escribieses un post y lo publicamos por aquí :) De lo que sí hablaremos (y mucho, pero más adelante) es sobre integración contínua. Paciencia.

## Taxonomía de las pruebas

Pero hey, mi intención hoy no era solo darte la brasa. ¡Quieres código y código vas a tener! Seguramente estás al tanto de que existen varios tipos de test y varias maneras de enfocarlos. Una clasificación ampliamente aceptada que a mi me gusta bastante los divide en unitarios, de integración, de interfaz de usuario/end-to-end/funcionales/comoquierasllamarlos (¡he escrito "interfaz"!) y de carga. Hay muchas otras clases de pruebas pero *grosso modo* esta categorización te servirá.

Te iba a explicar con detalle cada uno de estos tipos pero a la que he empezado a escribir me he dado cuenta de que no cabría en las tres mil palabras que me he puesto como límite en los posts. Así que vamos a centrarnos en el caso que podemos aplicar ya utilizando el código del post sobre {{%ilink "como-crear-un-api-rest" "creación de APIs"  %}} y dejaremos los demás para más adelante.

{{% activity %}}
Estás invitado e invitada a crear los flames que creas necesarios sobre las diferencias existentes entre pruebas de UI, end-to-end, pruebas funcionales y cualquier otra denominación que se te ocurra. No te cortes, yo me apunto a la fiesta.
{{% /activity %}}

## Todo tiene un precio

Si lo recuerdas lo único que habíamos hecho era generar el componente de controlador, que es quien se encarga de comunicar el microservicio con el exterior y por lo tanto el que finalmente publica el API. Gracias a él cuando arrancábamos el programa se creaba un servidor web y podíamos invocar los endpoints correspondientes.

Tal y como estamos ahora un test de interfaz de usuario queda descartado: no la hay. Y no, generar una tabla cuando el cliente pide HTML no es interfaz de usuario ;) Podríamos centrarnos entonces en los tests unitarios pero en el [actual estado embrionario del proyecto](https://github.com/programar-cloud/controlactividad/tree/1060) los datos están simplemente *hardcodeados* en las operaciones y aportarían poco valor. Así que sí, vamos a crear test de integración.

Se trata de conocer cómo se comportan los componentes de tu sistema cuando los utilizas conjuntamente. Por ejemplo, si la clase que aplica las reglas de negocio para manipular las entidades que modificas es capaz de recuperarlas correctamente de la base de datos. O si el controlador que has escrito se comporta como debería cuando un cliente hace la petición HTTP correspondiente.

Te puedes imaginar que esto no es tan barato como arrancar un pequeño objeto y ejecutar las operaciones que describen su comportamiento. Aquí estamos hablando de lanzar una copia (aunque sea simplificada) del despliegue final. Y lo tienes que hacer cada vez que vas a probar una operación determinada porque cada test tiene que encontrarse el sistema en un estado concreto y no muchas veces no es aceptable recibir influencia de la ejecución de otra prueba anterior.

{{% imgur "ipzXToB" "Típica respuesta de negocio a una explicación técnica" %}}

Según la tecnología que uses para implementar tu código podrás conseguir este *reset* de una forma u otra. A veces tendrás que reiniciar el servidor completo, o tu programa. En el ejemplo de la aplicación que estamos montando lo que haremos será reconstruir el *contexto* de SpringBoot, lo que básicamente tiene el efecto de reiniciar el módulo que implementa el API sin tener que pasar por el *bootstrapping* completo de Tomcat. En cualquier caso es una tarea pesada y tendrás que llegar a un equilibrio entre la pureza del estado que buscas y la velocidad a la que quieres poder ejecutar las pruebas.

Y sí, la base de datos suele ser un problema. Si los test de integración solo prueba la relación entre la capa de negocio (el código que efectúa la manipulación del modelo) y la capa de base de datos entonces suele ser posible  terminar cualquier transacción con un *rollback* para que no se consoliden los cambios. Pero si el test lo que hace es simular un cliente externo para entrar por el API y llegar hasta la cocina... ahí no hay forma práctica de utilizar ese truco porque por definición el inicio de la ejecución se encuentra fuera del servidor de aplicaciones y por lo tanto fuera del alcance la cualquier transacción. Proyectos como Docker pueden ayudar en algunos casos a permitir un comportamiento más natural al permitir instanciar copias de la base de datos en pocos segundos... anda, apúntalo en la lista de temas pendientes.

Sea como sea, y te lo digo muy en serio, ejecutar este tipo de tests puede llegar a ser realmente caro. De nuevo aplica pensamiento crítico y no confíes ciegamente en lo que lees (incluyendo lo que yo te cuento) y trata de poner en una balanza el esfuerzo que supondrá correr una batería de pruebas de este tipo y  el beneficio que obtendrás con ello. Estoy totalmente seguro de que querrás hacerlo antes de aprobar un cambio importante en una funcionalidad como parte de tu proceso de integración continua pero ¿querrás hacerlo también cada vez que haya un cambio pequeño realizado por una de las personas del equipo y que todavía no forme parte de la rama principal del código? Quizá. O quizá no.

Con suerte tu código estará dividido en pequeñas piezas independientes lo que facilitará todo este proceso: los tests a ejecutar vendrán delimitados de forma natural por el micro servicio en el que estés trabajando.

## Poner orden en casa del otro

Otro tip: hay un sorprendente número de empresas que han perdido el control de los productos de software que utilizan. Normalmente encargaron su creación a un equipo externo y el proceso de control de calidad de ese proveedor no ha sido... umh... totalmente adecuado. Y también puede ocurrir entre departamentos dentro de la misma casa. Sea como sea como consecuencia de ello ahora se encuentran conque una pieza estratégica de su negocio está en manos de un tercero que básicamente tiene la sartén por el mango y puede imponer las condiciones de desarrollo a su cliente cautivo.

En estas situaciones uno no puede menos [que recordar a los clásicos](https://youtu.be/aJ9RjKiqQV0?t=3m21s) y establecer un plan a medio plazo pero también puede empezar a implementar inmediatamente tests de integración que garanticen una mínima calidad sobre la funcionalidad del código. Exacto: si el proveedor no está dispuesto a mejorar su control de calidad siempre será posible imponerlo desde el exterior.

## Objetivo de las pruebas

En fin, ya he alargado la intro demasiado. Vamos a ver, descarga [el ejecutable de nuestro proyecto](https://github.com/programar-cloud/controlactividad/releases/download/1060/controlactividad-0.0.1-SNAPSHOT.jar) y arráncalo con un

```
java -jar controlactividad-0.0.1-SNAPSHOT.jar
```

En pantalla tendrás algo así:

{{% imgur "YEUULLL" "La consola es *amor*" %}}

Vamos a probar cómo se comporta, manualmente. Luego automatizaremos. Para complicarnos la vida lo menos posible utilizaremos el navegador: venga, carga esta dirección en él:

```
http://localhost:8080/cursos/cultura/unidades-didacticas/actividad
```

Deberías tener poder ver algo así:

{{% imgur "InZ09te" "Output esperado para text/html" %}}

Parece que funciona correctamente ¿verdad? Ahora la clave está aquí: en un escenario realista acabarías de comprobar que:

* El servidor de aplicaciones incrustado en el programa ha arrancado correctamente
* La aplicación se ha desplegado dentro de él
* El puerto 8080 permite ejecutar el endpoint HTTP de nuestro API
* Nuestro web service publica una operación en la ruta esperada
* La aplicación recibe los parámetros correctamente (nombre del curso, en este caso) desde el servidor
* La fuente de datos es accesible. Vale, vale, sigue estando simulada. No me he metido ahí. Pero no te pierdas en los detalles, estamos jugando.

## Los códigos de estado

Parece que somos felices, verdad. Pero no, no te engañes. Prueba esto: ```http://localhost:8080/cursos/deathcabforcutie/unidades-didacticas/actividad```. ¿Qué obtienes? ¡Exacto! Una bonita página en blanco. Eso es *MAL*. ¿Por qué? Porque no tiene semántica HTTP. Sería lógico devolver una página en blanco (o una lista vacía) si existiese un curso sobre [el grupo de Ben Gibbard](https://youtu.be/aoR0mGq_z2I?list=PL9FzrCRE_7NaTkRtUk5EJRtEq6lZJ7xUq) que no tuviese ni una sola unidad didáctica creada. Por ejemplo porque es nuevo y estamos todavía construyéndolo. O porque se han borrado. O porque yo qué sé. Pero no es el caso: [aquí](https://www.youtube.com/watch?v=oPwXHSqFl9Q) [no](https://www.youtube.com/watch?v=bpOSxM0rNPM) [hablamos](https://www.youtube.com/watch?v=Xsp3_a-PMTw&list=PLJhmviD_-i_-cQINoojICYq3kFsBdPtkH&index=7) [de](https://www.youtube.com/watch?v=NUTGr5t3MoY&list=PLo6aG-353Cqkrei8GU5adW9ZDbW_5Nl1X) [buena música](https://www.youtube.com/watch?v=GhCXAiNz9Jo), aquí hablamos de programación. No existe tal curso. Y estás accediendo mediante HTTP. ¿Cómo se representa esa situación?

{{% imgur "Iw2KxQs" "el error que estabas buscando" %}}

Pues aquí tienes otro punto que vas a comprobar cuando testeas APIs: los códigos de estado HTTP. Ahora te hago un resumen de los que te interesan como desarrollador o desarrolladora aunque hay algunos más como [Method not Allowed](http://www.checkupdown.com/status/E405_es.html), [Request time-out](http://www.checkupdown.com/status/E408_es.html), [Internal Server Error](http://www.checkupdown.com/status/E500_es.html), etc que con toda probabilidad serán generados automáticamente por el framework que utilices. Y como ya has visto el ```404``` puede aparecer tanto como resultado de una operación como por un error del lado del cliente.

Recuerda: si el código de estado empieza por 2 es que todo ha ido bien. Si empieza por 4 es que el usuario del API metió la pata al llamar al API. Y si empieza por 5 es que algo ha ido muy mal por nuestra parte.

| CÓDIGO&nbsp;&nbsp;          | NOMBRE           |SIGNIFICADO  
|:---------------------------:|:-----------------|:-----------
| 200      | **Accept**       | Todo ha ido ok, es tu respuesta estándar.  
| 201      | **Created**      | Has cambiado el estado de la aplicación, creando algo.  
| 202      | **Accepted**     | Ya lo hago luego. Muy útil para peticiones asíncronas.  
| 204      | **No content**   | Lo hago pero no retorno nada como respuesta.  
| 403      | **Forbidden**    | No tienes permiso para hacer lo que estás intentando.  
| 404      | **Not found**    | Lo que buscabas no existe.  
| 418      | **I'm a teapot**&nbsp;&nbsp; | Para implementar [mi RFC preferido](https://tools.ietf.org/html/rfc2324).  

## Al turrón: show me the code

Perfecto, ya tenemos dos temas controlados: que el API retorne la información que le pedimos y que la describa con el código que mejor se adapte. Es posible que también quieras comprobar en ocasiones las cabeceras que se devuelven y otro tipo de metadatos, dependerá de la funcionalidad que implementes.

{{% warning %}}
**Disclaimer**: amablemente varios de vosotros me habéis comentado que os sangran los ojos cuando leéis mi código y lo encontráis escrito en castellano. Y no es para menos, la verdad. Pero cuando doy formación suelo usar el idioma para hacer más fácil la distinción entre la parte que añadimos nosotros y la que viene proporcionada por el framework de turno. Dicho lo cual, si te veo escribiendo código en español me presentaré a las tres de la mañana en tu habitación para cantarte [Corazón Marinero](https://www.youtube.com/watch?v=XQ3ZrgYIIgc) al oído. Quien avisa no es traidor.
{{% /warning %}}

Puedes encontrar [bajo la rama 1070](https://github.com/programar-cloud/controlactividad/tree/1070) el código actualizado por el proyecto (incluyendo tests de integración). En este caso para poder probarlos necesitas descargar e instalar [Maven](http://maven.apache.org/download.cgi) que es la herramienta usada para automatizar el procesamiento del código. Una vez la tengas en el ```PATH``` de Windows consigue el código fuente (haciendo un clone con git o bien descargando y descomprimiendo [el fichero zip](https://github.com/programar-cloud/controlactividad/archive/1070.zip)). En cualquier caso entra en la carpeta del proyecto (la que contiene el fichero ```pom.xml```) y ejecuta:

```bash
mvn verify
```

Verás cómo se compila todo el código y se ejecutan los tests correspondientes.

{{% imgur "oSKAJbg" "¿Somos felices? Somos felices." %}}

En un curso paralelo a este te explicaré los detalles de implementación pero si quieres echarle un primer vistazo busca la clase ```ActividadUnicoCursoCtrlIT```. La primera parte del nombre indica el controlador que estamos probando y el sufijo IT es la contracción de *integration test* (en contraposición a un simple *Test* que suele asociarse a los unitarios).

En el código verás que las anotaciones juegan un rol de configuración muy importante y que cada test individual está definido en una rutina independiente. Recuerda que como hemos dicho antes puede ser necesario que cada prueba se encuentre el estado del sistema en las mismas condiciones iniciales así que Spring reiniciará el contexto de la aplicación antes de ejecutarlas.

Esto significa que si tienes cuatro métodos en esa clase anotados con ```@Test``` verás cómo la aplicación se reinicia cuatro veces aunque eso sí, todas las ejecuciones reutilizarán la misma instancia de Tomcat. Estrictamente hablando esto no es necesario en este caso porque no manipulamos los objetos que se encuentran en dicho contexto pero como estás siguiendo un curso y en los cursos solo tenemos tiempo de crear ejemplos simplificados creo que es mejor que veas este caso.

## ¿Dónde estamos?

Bien, debería haber quedado bastante claro: somos capaces de probar nuestra API de forma automatizada gracias a Maven. Y sí, sí, ahora mismo hemos sido nosotros los que nos hemos encargado de hacerlo pero cualquier sistema de CI puede lanzar esa tarea sin ningún problema.

El siguiente paso para mejorar nuestro API va a ser crear una documentación mínima. Veremos cómo podemos hacerlo pero sobre todo insistiré en lo importante que es que se genere automáticamente para que sea práctica. Nos vemos en nada.

Y de nuevo, recuerda: no seas la lechuga.

jv

pd: [Marcus](https://soundcloud.com/musicbymarcus/promo-music-inspiational) se encarga una vez más de la música de la entradilla. Sonríe.

ppd: La foto que identifica al post es de una escultura llamada [Traffic Tree Light](https://en.wikipedia.org/wiki/Traffic_Light_Tree). La tomó [William Warby](https://www.flickr.com/people/26782864@N00), que ha tenido la generosidad de publicarla de forma libre.

pppd: Scott Adams tiene spyware instalado en mi ordenador: [hoy](http://dilbert.com/strip/2017-01-03) ha publicado la tira de Dilbert que me hacía falta.

ppppd: Recuerda que Jack Nicholson termina mal en *Algunos hombres buenos*.

pppppd: El nuevo límite oficial de los posts es de 4000 palabras, hasta que escriba otro que supere este número.

ppppppd: Abrazo grande y kudos para [Fede Álvarez](https://blog.falvarez.es/) que me ha hecho la revisión y corrección del {{% ilink "como-crear-un-api-rest" "post anterior" %}} :D
