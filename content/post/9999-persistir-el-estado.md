---
title: Persistir el estado (Bases de datos, caches & cía)
date: 2017-03-01T22:14:20+01:00
description: "Datos, datos datos: hoy te cuento cómo guardarlos sin que a medio plazo tengas un problema de coste o escalabilidad."
slug: persistir-el-estado-en-la-base-de-datos
draft: false
tags:
- arquitectura
- programación
- java
- springboot
- basededatos
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

disqus_identifier: persistir-el-estado-en-la-base-de-datos
disqus_title: Persistir el estado en la base de datos
disqus_url: "https://programar.cloud/post/persistir-el-estado-en-la-base-de-datos"
---

{{% img src="/media/1090-kindle-from-maxpixel.jpg" alt="Documentación electrónica" %}}

*TL;DR: Tienes a tu disposición una enorme variedad de productos de almacenamiento con características específicas. Usa todos los que necesites para alcanzar tus objetivos de rendimiento y expresividad pero ni uno más.*

{{% archive "como-documentar-con-spring-rest-docs" %}}

Cuando pasas varios años de tu vida recibiendo martillazos al final siempre te acuerdas del martillo cuando tienes un dolor de cabeza. El martillo es la base de datos relacional, claro: estamos tan condicionados que ni siquiera solemos usar el adjetivo, simplemente nos referimos a ella como *la base de datos*.

Y es un error, claro. Porque es una tecnología que se diseñó [hace cuarenta años](TODO!) en un mundo muy diferente al nuestro en el que (por ejemplo) el juego más sofisticado que existía era [Asteroids](TODO!). Amigo, amiga: prueba a compararlo con el [Witcher III](TODO!). No, en serio, párate a pensar durante diez segundos en todo lo que hemos recorrido durante este tiempo y verás claro que hay que aprender nuevas herramientas y nuevas formas de pensar. Ahora te explico algunos patrones para que te sea más fácil.
<!--more-->

Está claro que quieres guardar tu información de manera fiable ¿verdad? No quieres, bajo ninguna circunstancia, perder ni uno solo de esos preciosos bits que recibes ¿No? Cueste lo que cueste, si han  llegado hasta nosotros es porque queremos acumularlos, tiene sentido, es lo que siempre nos han enseñado.

Pues claro que no tiene sentido. Acumular bits a cualquier precio independientemente de su valor de negocio no tiene ni pies ni cabeza, es el Diógenes de nuestra época. Cada vez que quieras guardar un dato pregúntate cómo lo vas a utilizar, qué importancia tiene a corto y a largo plazo.

Por ejemplo: la sesión del usuario. Ya sabes, son los datos que necesitas mantener para que la personita que accede a tu aplicación pueda completar el trabajo que está haciendo en ese momento. Vamos a imaginar que añadimos la posibilidad de comprar cursos en nuestro blog y por lo tanto tendremos que mantener el típico carrito de la compra.

Espera ¡un momento! Sé lo que estás pensando. Estás pensando que un API, por definición, tiene que ser *stateless*: cada invocación debe ser independiente de la anterior para asegurar que escalamos horizontalmente añadiendo más máquinas a la flota y distribuyendo el tráfico de forma arbitraria entre ellas. Pero es que incluso si fuésemos unos tristes y nuestra aplicación no se basase en un API seguiría siendo por el mismo motivo un antipatrón de escalabilidad guardar este tipo de datos en el servidor de aplicaciones: la caída de uno de los nodos de esa capa de la aplicación haría que se perdiesen los datos que mantuviésemos en él y nos enfrentaría a usuarios enfadados.

Pero todo esto no significa que no exista el concepto de sesión de usuario, solo significa que está más distribuido. Porque está claro que vas a tener un microservicio para gestionar el carrito de la compra y que el estado del mismo va a ir evolucionando conforme nuestro cliente añada más productos ¿no?. La clave está en que esos datos son efímeros: cuando el cliente cierra su navegador y se va a hacer la cena no espera (en general) que el carrito siga disponible dos horas más tarde. De hecho, puede ser contraproducente como experiencia de usuario si lo que estaba haciendo era solo chafardear.

Entonces ¿cómo almacenamos esta información? Hazte preguntas, siempre. ¿Para qué necesitamos el carrito de la compra? ¿Qué valor de negocio tiene? ¿Qué tiempos de acceso necesitaremos? ¿Cómo estructuramos estos datos? Y por lo tanto ¿Dónde los colocaremos?

Empecemos por la primera. Obviamente el carrito de la compra es lo que va a permitir al usuario adquirir el curso correspondiente para que podamos pagar las facturas a final de mes. Pero también como dueños del producto nos dejará analizar qué patrones sigue nuestro negocio: si una determinada campaña de promoción incrementa las ventas, cuál es la distribución de nuestros clientes, si hay problemas de conversión que quizá estén relacionados con algún bug en la integración con pagos, etc. Está bastante claro que tenemos dos escenarios: la operativa y la analítica (TODO!) y que si no queremos perder oportunidades de negocio las dos son necesarias y medir los KPI (TODO!) más obvios.

Pero ¿tienen el mismo patrón de acceso? Diría que no. Es bastante obvio que desde el punto de vista del usuario su carrito debe de funcionar en tiempo real mientras que para el dueño del producto tener los datos  de ventas con un decalaje de tiempo no es un problema real. Quizá al principio crea que sí, pero maldita sea, tener datos en tiempo real es muy caro. En cambio hacer un cierre de caja a final del día (o cada dos horas) resulta muchísimo más barato. Y en el tipo de negocio que nos encontramos (un proveedor de formación súper especializado) creemos que no aporta una ventaja competitiva significativa.

Así que para solucionar la segunda parte ¿por qué no simplemente utilizamos los logs? Allí encontrarás si los programamos correctamente la información sobre el usuario, las acciones que vaya realizando, los errores que se generen... y los tendrás como un stream de eventos, ordenados temporalmente. Más tarde, cuando quieras, puedes procesarlos como mejor te convenga transformándolos para insertarlos en una base de datos mediante un proceso ETL. Y si más adelante necesitamos tiempo real solo tenemos que utilizar algún producto de procesamiento de streams como [AWS Kinesis](TODO!), [Azure Event Hub](TODO!) o [Apache Kafka](TODO!).

Vale, vale. Pero entonces para el carrito de la compra que presentamos al usuario sí usaremos una base de datos relacional ¿no? Quiero decir ¡que hay que ponerla en algún sitio! ¿verdad? Lo cierto es que si estructuramos astutamente los datos no nos va a hacer falta: si lo hacemos como un objeto que contenga las líneas de producto compradas junto con los agregados más comunes la personita encargada de la pantalla va a necesitar cero esfuerzo para dibujarlos. Algo así:

``` json
{
   "usuario" : "alice@wonderland.com",
   "pais" : "España",
   "moneda" : "euro",
   "lineas"  : [
     { "codigo" : "cultura", "nombre" : "Creando una cultura cloud", "precio" : 20 },
     { "codigo" : "cicd", "nombre" : "Integración continua en cloud", "precio" : 40 },
     { "codigo" : "spring", "nombre" : "Microservicios con SpringBoot", "precio" : 100 }     
   ],
   "baseImponible" : 160,
   "tipoIva" : 0.21,
   "cuotaIva" : 33.6,
   "total" : 193.6
}
```

Este es el tipo de estructura que necesitas para mostrar la información que le interesa al usuario y para arrastrar su estado a lo largo de la sesión. Es una estructura anidada, en forma de documento, con formato JSON. Y seguro que sabes que cualquier cliente es capaz de manipular este formato de manera trivial. Por ejemplo, si las pantallas de dibujan en un navegador ya sabes que es compatible (por diseño) con Javascript. ¡Así que simplemente puedes usar [el objeto sessionStorage](TODO!) para almacenarlo allí! Y recuerda: la CPU del navegador la paga el usuario, no tú. Y lo que guardes allí no necesitas transferirlo por red por lo que tienes latencia 0.

Obviamente no te estoy diciendo que almacenes datos críticos solo en el cliente: un porcentaje de tus usuarios terminará (¡esperemos!) generando una orden de compra y saltando a la pasarela de pago que elijas. Este pedido **debe** de registrarse en el servidor y quizá en ese momento sí te plantees utilizar una tecnología con la que tienes mucha experiencia, como una base de datos relacional. Pero si has seguido la receta hasta ahora verás cómo hemos reducido los impactos en la misma quizá a un 25%.

A veces puede que la información que tu usuario esté manipulando tenga que presentarse en varios dispositivos distintos. Por ejemplo imagina que publicamos los posts de este blog como un libro en soporte papel. En ese caso seguramente tendremos que controlar el stock para dejar de admitir compras cuando no nos quede material físico que servir. Imagina que en lugar de un libro vendemos unos cuantos cientos, maldita sea, imagina que somos O'Reilly TODO!. ¡Bien! Estarás pensando. ¡Aquí sí que puedo usar mi relacional!

Puedes. Pero no es una buena idea: obtener la información del stock de un catálogo grande puede

http://neopythonic.blogspot.com.es/2011/08/compare-and-set-in-memcache.html













.
