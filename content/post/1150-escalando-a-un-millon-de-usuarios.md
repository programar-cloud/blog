---
title: "Instagram: Escalando a un millón de usuarios"
date: 2017-11-10
description: "En este post te cuento cómo desacoplar capas de tu aplicación y distribuir la carga que reciben los nodos a través de la historia de Instagram."
slug: escalando-a-un-millon-de-usuarios
draft: false
tags:
- seguridad
- arquitectura
- balanceadores
- patrones
- desacoplamiento
temas:
- arquitectura
niveles:
- Intermedio

episode : "30"
audio : "https://archive.org/download/escalando-a-un-millon-de-usuarios/escalando-a-un-millon-de-usuarios.mp3"
media_bytes : "25729121"
media_duration : "35:53"
images : ["https://programar.cloud/media/1150-rabbits.jpg"]
explicit : "no"

disqus_identifier: escalando-a-un-millon-de-usuarios
disqus_url: "https://programar.cloud/post/balanceadores"
disqus_title: "Instagram: Escalando a un millón de usuarios"
---
{{% img src="/media/1150-rabbits.jpg" alt="¡wuaaaaaaaaaaaaaah!" %}}

*TL;DR: El truco básico para conseguir escalar es añadir más hierro, no hierro más grande. Y cuando lo haces la forma más sencilla de distribuir el tráfico es utilizar balanceadores de carga.*

{{% archive "escalando-a-un-millon-de-usuarios" %}}

Venga, voy a contarte una historia, que hace tiempo que no te explico ninguna. Tiene moraleja, claro: que esto no deja de ser un curso y por lo tanto vas a tener un diablillo detrás de la oreja diciéndote lo que no tienes que hacer y cómo solucionar tus problemas de arquitectura. ¡Pero no se gana el trivial y se triunfa en la tertulia de los amiguetes hablando de escalabilidad horizontal y balanceadores de carga sin más! Así que vamos a hablar un rato de Kevin, Mike y su pequeño proyecto.<!--more-->

## La historia de Kevin

Kevin empezó a trabajar en Google justo después de terminar la universidad. Un tío feliz, implicado en proyectos como Google Reader. Sí, sí: esa aplicación que amaste cuando te enteraste de que existía, aproximadamente diez minutos antes de que la cerrasen.

> Mike era de Sao Paulo así que durante unos segundos no pareció muy emocionado por la idea de su compañero.

Era 2010 y Kevin estaba echando la tarde bebiendo una cerveza con su amigo Mike y comentando la noticia de que Facebook [compraba una startup llamada NextStop](https://techcrunch.com/2010/07/08/facebook-acquires-social-travel-recommendation-site-nextstop/) (un clon de Foursquare) creada por exgooglers [por 2.5 millones de dólares](https://www.quora.com/How-much-did-Facebook-pay-to-acquire-NextStop). "Tiiiiiiiío, qué pasta, con eso me iba a vivir a Brasil. Tendríamos que hacer algo así." le dijo. Mike era de Sao Paulo así que durante unos segundos no pareció muy emocionado por la idea de su compañero. Pero ya sabes qué pasa: dos cervezas más tarde ya estaban hablando de salir a bolsa y comprar un jet privado.

Lo curioso es que después de la resaca se pusieron a ello. Si copiar a Foursquare les había funcionado a los de NextStop estaba claro que copiar a NextStop no podía fallar ¿cierto? Fundaron una compañía de geolocalización basada puramente en HTML5 llamada Burbn (2010, ya sabes: las vocales costaban un dineral) [y recibieron 500K pavos de financiación](https://techcrunch.com/2010/03/05/burbn-funding/). 

{{% imgur "KwxtNfV" "Spidermoney is good money"%}}

**Gastaron $3000 en comprar unos cuantos servidores y pizzas antes de darse cuenta de que no iban a ningún sitio.**

El plan B consistía en que tras pasar un fin de semana de vacaciones con la novia Kevin le diría a los inversores que había sido un placer conocerles y que aquí tenían los 497.000 dólares que habían sobrado. Que muchas gracias y un abrazo.

El caso es que ese fin de semana obviamente estuvo dándole vueltas a qué había funcionado y qué había fallado con su proyecto.

—¿Sabes lo que al final usaba más todo el mundo? —preguntó a su pareja —las fotografías. Compartir fotos desde el móvil. Cariño ¿Tú crees que hay un mercado para vender eso?

Su compañera le contestó que con la basura de fotos que ella era capaz de hacer en la vida se le ocurriría compartirlas con nadie. Que las suyas no eran como las de su colega Richie, que él sí sabía hacer fotos con el móvil. Ya está: *Richie*. Otra vez el pesado de *Richie*. Ligeramente muy irritado Kevin contestó:

—Oh, pero si no tiene ni idea: las fotos le quedan resultonas porque antes de mandarlas les pasa como diez filtros difer... Umh... espera un momento.

Y así es exactamente [cómo nació Instagram](https://techcrunch.com/2010/09/20/instagram/).

{{% imgur "1o7wFHM" "Esto no es Instagram"%}}

## Proyectos globales

La primera versión de Instagram arrancó en un *colo* (un datacenter en el que alquilas espacio para tus propias máquinas) a las doce de la noche, con la intención de que la entrada de usuarios fuese progresiva. Durante una hora monitorizaron el comportamiento y viendo que tal como habían previsto la actividad era muy baja se fueron a dormir. **Obviamente cuando despertaron el servidor estaba quemando cromo como si el mundo terminase al día siguiente con 25.000 usuarios nuevos, en su mayoría asiáticos y europeos**.


{{% remark %}}
Primera regla de escalabilidad: si tu proyecto es global y sirves desde una misma instalación recuerda que no vas a tener un pico de entrada sino varios, según la tierra gira alrededor de sí misma. Cuidado con programar mantenimientos antes de conocer el comportamiento de tu sistema.
{{% /remark %}}

## Monitorización y logs

No te preocupes que en un rato sigo contándote cómo le fue a estos dos. Pero déjame que antes te haga una pregunta: **¿Sabes cuál es el componente más difícil de escalar hoy en día?** Exacto, tú. Es muy difícil conseguir técnicos y técnicas para desarrollar y operar correctamente. Y por lo tanto si quieres crecer es clave que automatices tanto como puedas tan pronto como sea posible.

> Si quieres crecer es clave que automatices tanto como puedas tan pronto como sea posible.

Para ello necesitarás un sistema de monitorización que recolecte métricas y logs para poder programar reacciones automáticas o incluso predecir futuros problemas. Pero de esto hablamos otro día ¿de acuerdo? Algo que te quería contar hoy es lo poco glamuroso que puede llegar a ser un problema de rendimiento cuando enfrentas tu maravillosa y súper testeada aplicación a tus primeros *usuarios reales* (tm).

Porque inicialmente la arquitectura que habían diseñado nuestros amigos tenía algún problema no totalmente obvio. ¿Sabes qué consumió una cantidad de recursos absurda en el lanzamiento de Instagram? El `favicon.ico`. Sí, ese icono que aparece en la barra de navegación cuando se visita un site y que el navegador pide automáticamente cuando entra en un dominio. O mejor dicho: la ausencia de ese fichero. Que generó una enorme cantidad de entradas en log reportando el correspondiente 404 impactando en el rendimiento de la aplicación.

{{% remark %}}
Segunda regla de escalabilidad: son los pequeños detalles los que hacen tu vida miserable, los que no salen en tu diagrama de arquitectura. Prueba con tráfico real tu sistema tan pronto como puedas para tenerlos controlados.
{{% /remark %}}

## Arquitectura original de Instagram

El frontal inicial de Instagram era una App, algo totalmente lógico dado que se trataba de hacer y manipular fotos tan ágilmente como fuese posible. Oye ¿quién paga el hardware donde corre la App? ¡Exacto, el usuario!

Hasta ahí muy bien. Ahora vamos a ver el backend: estaba implementado en Python. Sí, no es el lenguaje más rápido del mundo. Además inicialmente el despliegue en producción consistía en una única máquina que integraba tanto el runtime de Python como la base de datos (PostgresSQL). Esto tiene varios problema obvios:

* Un fallo de hardware supone una caída completa del sistema al no tener la infraestructura física duplicada.
* Un fallo de software (por ejemplo, un bug en la aplicación) afecta a todos los usuarios y también al resto de componentes del sistema (como la base de datos).
* Una actualización de cualquier elemento impacta en todos los usuarios irremediablemente a pesar de tener ciclos de vida independientes.
* Facilita el acoplamiento entre las piezas del sistema y si este llega al punto en el que no pueden separarse fácilmente la única forma de crecer será poner hierro más potente (escalado vertical) que es la forma más cara y limitada de mejorar el rendimiento.

Vuelve un momento a repasar los puntos anteriores, sobre todo el tercero. Seguramente eres consciente de ellos pero también hay bastantes posibilidades de que sigas cayendo en este tipo de errores en tus proyectos. Por cierto, la máquina que utilizaban como servidor era menos potente que un Macbook pro de 2010.

> Kevin comentó en alguna ocasión que "escalar Instagram fue el equivalente a cambiar todas las piezas de un coche... mientras conduces a 180km/h."

Te puedes imaginar la primera semana de vida del proyecto: las ojeras de Kevin y Mike llegaron a hacerse permanentes mientras peleaban por mantener viva la criatura. Kevin comentó en alguna ocasión que "escalar Instagram fue el equivalente a cambiar todas las piezas de un coche... mientras conduces a 180km/h.".

## Desacoplar componentes

La primera decisión es obvia: separar la base de datos en una máquina independiente. Puede parecer simple (y en general no es *rocket science*) pero ten en cuenta que **la latencia se verá incrementada** y que por ello tienes que mantener las dos piezas tan cerca una de la otra como puedas. Y sobre todo recuerda que ahora te comunicas a través de una red y esto tiene siempre implicaciones de seguridad. Como te conté en {{% ilink "como-implementar-la-seguridad-en-tu-api-parte-1" "el post sobre seguridad" %}} implementa [tls](https://es.wikipedia.org/wiki/Transport_Layer_Security) y configura correctamente las reglas de *firewall*.             

## Escalado horizontal

¡Pues claro! ¡Replicar componentes! En lugar de poner una mula más grande para resolver el problema más rápido siempre sale más barato añadir más mulas que hagan el mismo trabajo. Pero esto hace que surjan una serie de problemas, como describe muy bien uno de mis gráficos preferidos:

{{% imgur "BIagBBb" "Descripción gráfica de DOLOR" %}}

En serio, échale un vistazo serio al punto marcado por la etiqueta *dolor*. ¿Sabes cuál es la mejor manera de ahorrártelo? Eso es: empezar desde el principio con al menos dos máquinas para tu backend. De esta manera te aseguras de que:

* No tienes un único punto de fallo
* Puedes aplicar parches y hacer despliegues sin afectar a todos los usuarios
* Es más difícil crear acoplamientos fuertes

Lo sé, lo sé: ahora mismo hay una corriente que aboga por hacer las cosas sencillas al principio y no añadir la complejidad de un diseño distribuido hasta que es necesaria. Pero en realidad siguiendo las normas que te he ido explicando (y explicaré) en este blog no resulta tan difícil implementarlo. De hecho te diría que es más o menos igual de complicado. Pero son decisiones estructurales que tienen eco a lo largo de todo tu código así que modificarlas cuando ya has invertido miles de horas en él es muy (muy) costoso.

Por suerte Kevin y Mike habían pensado en esto desde el principio así que pudieron agregar de forma más o menos sencillas replicas adicionales. Pero eso supone un problema: cada máquina tenía ahora su propia dirección IP, su propio punto de entrada en el sistema. ¿Cómo íban a repartir las conexiones de los usuarios entre ellas? Debían balancear la carga.

## Balanceadores de carga

El *load balancer* es una pieza clave de tu arquitectura. Por un lado ofrece a tus usuarios un único punto de entrada en el sistema y por otro reparte el las peticiones que llegan entre tu flota de servidores. Kevin y Mike utilizaron al principio dos instancias de [nginx](https://www.nginx.com/) que derivaban el tráfico hacia la flota de servidores. ¿Por qué dos? Porque el balanceador de carga en sí también tiene que estar en *alta disponibilidad*, claro.

{{% imgur ugNk3qj ""%}}

Sé la pregunta que te estás haciendo: si hay dos *nginx* ¿a cuál de ellos enviamos al usuario? Y aquí entra un segundo nivel de balanceo a través de DNS: cuando la aplicación desde el teléfono del usuario resolvía el nombre *instagram.com* el servidor de nombres retornaba alternativamente la IP del primer balanceador o del segundo.

Pero entonces ¿por qué no usar DNS para directamente enviar las peticiones a una máquina u otra? Tienes varios motivos de peso. 

El primero de ellos quizá otro día te lo cuente con más calma pero dicho en pocas palabras no hay forma de controlar realmente el tiempo que pasa desde que haces un cambio en el registro de nombres de tu servidor DNS y este cambio se propaga hasta tus aplicaciones. Aunque en la configuración digas que *instagram.com* resuelve a la IP 1.2.3.4 durante tan solo los próximos 60 segundos es muy probable que una actualización tarde muchísimo más tiempo en llegar hasta el cliente final, sobre todo si utiliza (como la gente normal) el teléfono para acceder a tu aplicación.

El segundo de ellos es la seguridad: es mucho más sencillo controlarla si reduces la *superficie de exposición* de tu sistema haciendo que toda entra al mismo tenga que pasar por ese punto centralizado, esos balanceadores.

{{% imgur 7S8kvBl "Esto pasa al balancear por DNS" %}}

Vale, vale. Pero hace un rato te había dicho que los usuarios en sí alcanzaban un balanceador u otro según lo que dijese la DNS ¿verdad? Bueno, sí. **Pero la flota de servidores va a ser probablemente mucho más dinámica que la de balanceadores porque su trabajo es más complicado y va a cambiar más a menudo. Por lo que usar DNS sobre la capa de balanceo es un mal menor**.

Otra cosa es que quieras utilizar un DNS interno como registro de servicios en tu sistema, es decir, si lo que quieres es poder abrir conexiones simplemente refiriéndote a un nombre de dominio (por ejemplo, estableciendo una conexión a `controlstock.internal`). Dado que en ese caso eres tú quien controla el tiempo de vida efectivo del registro DNS es una opción perfectamente válida aunque puede tener la limitación de no permitir seleccionar el puerto de destino. Bueno, apunta también este tema del *service registry* para más adelante.

Y ojo, que la siguiente pregunta no es trivial: ¿qué necesita una máquina para que un balanceador de carga que se ejecute en ella sea feliz? ¿CPU? ¿RAM? Venga, piénsalo un segundo. ... ... ... ... ... ... ... ... ... ... ... ... Exacto: red. Necesita red. El típico recurso en el que no caes cuando dimensionas infraestructura pensando en máquinas virtuales. No le escatimes ancho de banda a tus balanceadores de carga.

## Aplicaciones stateless

Por suerte para Mike y Kevin su aplicación estaba bien diseñada y no tenía el problema que te voy a contar ahora. Se trata de la costumbre que tienen algunos programadores de guardar los datos con la sesión del usuario en los nodos de aplicación de manera que todas las peticiones de la misma persona deben enrutarse al mismo nodo para poder completarlas. Esto limita el balanceo: dejas de poder enviar cada petición a un servidor distinto y todas aquellas que se generen en el mismo usuario tienen que ir a parar a la misma máquina.

Este antipatrón se conoce como *sticky sessions*. Solo por el nombre ya debería darte mucha grima. Asegúrate de que no es tu caso porque apareceré en casa a las tres de la mañana para cantarte [Corazón Marinero](https://www.youtube.com/watch?v=_HQ5Jk1MV5c). Lo sabes.

{{% remark %}}
Tercera regla de la escalabilidad: haz que los nodos que sirven la aplicación sean *stateless* de manera que todos ellos tengan acceso a la información relativa a la sesión a través de algún mecanismo compartido, como un [redis](https://redis.io) situado en otra máquina, por ejemplo.
{{% /remark %}}

## Escalar en un entresuelo

Te va a parecer una tontería pero un *colo* no es más que una o varias plantas en un edificio. Y el espacio es limitado. Y si creces lo suficiente terminas llenándolo. ¿Cuánto crees que creció Instagram? bueno, el primer día en el que lanzaron la versión Android de la app ganaron un millón de usuarios. Imagínate.

En algún momento nuestro dúo dinámico entendió que físicamente no podrían añadir más hierro a su instalación. Y ojo, igual no lo he dicho explícitamente, pero entre ellos dos se encargaban **de todo**. Dos tipos cuya formación había estado centrada básicamente en UX y programación de Javascript en el navegador (con algún toque de Python en el servidor) tenían que pelear para mantener vivo un ser que crecía exponencialmente. #Respect.

{{% imgur Y8XtkTK "Kevin manteniendo bajo control el backend" %}}

De nuevo: la parte humana de un proyecto es la más difícil de escalar correctamente. Así que rápidamente tomaron la decisión lógica y abandonaron su *colo* para migrarlo todo a un cloud público: [AWS](https://aws.amazon.com). Delante de los *nginx* pusieron un *Elastic Load Balancer*. Dentro de poco te hablaré con más calma de esa maravilla: por 20 pavos al mes tienes un balanceador gestionado capaz aceptar cientos de miles de peticiones nuevas por segundo.

Recuerda que nuestros intrépidos aventureros eran dos personas, brillantes y trabajadoras, pero dos. Y que su campo de conocimiento no era sistemas y mucho menos el cloud. La migración a AWS salvó la vida del proyecto pero por falta de conocimiento no aprovecharon una característica clave del cloud de Amazon: el uso de VPC (redes). Esto tuvo sus repercusiones, como verás más adelante.

{{% remark %}}

Cuarta regla del escalado: prioriza el uso eficiente de tus recursos más escasos. Si son los cerebros de las personitas que están creando tu producto intenta permitirles centrarse en él, no en instalar parches en un servidor a las tres de la mañana.

{{% /remark %}}

## El almacenamiento

Casi siempre que pensamos en crecimiento exponencial nos quedamos mirando hacia el infinito, con ojos vidriosos, imaginando cientos y cientos de máquinas solucionando nuestros problemas de CPU. Pero Instagram tenía otros factores limitantes: siendo una red social basada en fotografías rápidamente se encontraron conque [tenían que almacenar 100TB](https://www.quora.com/How-much-did-it-cost-Instagram-originally-to-store-their-photos-and-videos-on-amazon-S3) de manera fiable, disponible y que no complicase los backups. Vale, vale: seguramente sabes que eso es exactamente lo que proporciona el servicio [S3](https://aws.amazon.com/s3/) de Amazon. Apunta también este tema para otro día.

En cualquier caso inicialmente no guardaban en el cloud las fotografías originales: **solo una versión con una calidad mínima suficiente para verse bien en el móvil**. Chicos listos ¿eh? Así era más fácil transmitirlas por la red telefónica y ocupaban solo un 5% del tamaño original.

{{% remark %}}
Quinta regla de la escalabilidad: la experiencia de usuario es mucho más importante que la perfección técnica. Si la gente es feliz con una fotografía de 600x600 píxeles no te obligues a almacenar un *raw* de 4 megas.
{{% /remark %}}


{{% imgur ddKq466 "" %}}

### La base de datos

¿Y la base de datos? ¿Qué me dices de ese pobre PostgresSQL? No utilizaron [RDS](http://aws.amazon.com/rds) (bases de datos gestionadas) porque no estaba disponible en el momento en el que migraron a AWS así que se limitaron a desplegar sobre máquinas virtuales EC2. 

Todas las bases de datos se desplegaban en dos nodos: un master y un slave. La sincronización se hacía mediante streamings y durante mucho tiempo los backups eran *snapshots* de los [discos EBS](https://aws.amazon.com/ebs) (algo muy sencillo de implementar). Porque recuerda que una configuración *master*/*slave* proporciona alta disponibilidad pero no elimina la necesidad de hacer backups ni incrementa necesariamente el throughput de la base de datos: en muchas ocasiones el *slave* no puede utilizarse ni como nodo de lectura (para ello tendrías que añadir read-replicas) y en cualquier caso muy pocas relacionales admiten escribir en más de un *master*.

Vale, ok, pero estamos hablando de escalabilidad. ¿Entonces cómo la conseguían? ¡Escalando horizontalmente con sharding! Básicamente repartían la información entre distintas bases de datos, entre distintos nodos con PostgresSQL. Simplemente cogían el registro a escribir y basándose en el identificador del usuario lo enviaban a un nodo u otro. La gran mayoría de usuarios tenían una actividad parecida así que el trabajo se repartía suficientemente bien. Obviamente si en algún momento tenían que cruzar datos situados en distintos nodos tenían un problema muy serio pero diseñaron el producto para que no fuese necesario.

Los detalles sobre cómo lo hicieron (¡y el código para implementarlo tú mismo!) los tienes en el proyecto [instashard](https://github.com/alfredbaudisch/ecto_instashard).

PostgresSQL era adecuado para guardar la información asociada a las fotografías, a los usuarios, etc. Pero temblaba cuando intentaban ejecutar las consultas necesarias para montar el *feed* (la cronología), que al fin y al cabo era el centro de la experiencia de usuario de la aplicación... sobre todo cuando Taylor Swift subía cualquier cosa.

{{% imgur luofNm8 "No es Taylor Swift" %}}

Para solucionar esto añadieron más instancias con *Redis* que almacenaban en memoria el esqueleto de estas cronologías. Porque las bases de datos relacionales son estupendas para solucionar un gran número de problemas pero no es ni de lejos la única opción disponible. Y un *memcached*, una cola o un pequeño archivo estático pregenerado en muchas ocasiones te arregla la vida.

{{% remark %}}
Sexta regla de escalado: la mejor manera de aumentar el throughput de una base de datos relacional es no utilizarla (por ejemplo, porque consultas previamente una caché).
{{% /remark %}}

En cualquier caso llegó un momento que aún así les costaba mantener la coherencia de la flota redis respecto a las máquinas postgresql así que simplemente rompieron el nudo gordiano modificando el funcionamiento de la aplicación: Instagram [dejó de mostrar todas y cada una de las fotos del feed](http://www.telegraph.co.uk/technology/2016/06/06/why-your-instagram-feed-is-now-out-of-order/).

{{% remark %}}
Séptima regla de escalabilidad: a veces es mejor cambiar el enfoque y reinventar la forma de funcionar en lugar de seguir quemando más y más recursos en una batalla que te desgasta completamente.
{{% /remark %}}

Por cierto, en 2014 [migraron de Redis a Cassandra](https://www.datastax.com/dev/blog/facebooks-instagram-making-the-switch-to-cassandra-from-redis-a-75-insta-savings). Pero de nuevo, esa historia queda para otro día que hoy ya me estoy alargando demasiado.

## Empollones con ojeras y pasta gansa

Y así fueron peleando y luchando hasta que Larry Page de Google les llamó para decirles que quería comprarles la empresa por un dineral. Kevin y Mike respondieron que necesitaban unos días para pensarlo, colgaron, se miraron el uno al otro durante unos segundos **e inmediatamente llamaron a Mark Zuckerberg para pedirle mil millones de dólares por la empresa**. Mil millones. 1.000.000.000 de guita, cash, billetes verdes, presidentes muertos. Y de esta manera Instagram pasó a formar parte de Facebook.

Habían transcurrido 536 días desde ese fin de semana de vacaciones con la pareja.

{{% imgur oAfMkG7 "No es Kevin contando la pasta" %}}

## Epílogo: escalar con financiación infinita

Facebook no tiene problemas de liquidez, al contrario. A mí me gusta imaginarme a Mark nadando entre monedas de oro como tío Gilito. Y el core de su negocio es muy tecnológico: es cierto que el software es un medio para vender publicidad pero es **el medio**. Por ello no escatiman ni intentan ser especialmente eficientes en el uso de recursos.

Cualquier ingeniero o ingeniera que trabaje allí tiene un portátil con 64GB de RAM. ¿Las necesita? Fuck no, en general. Pero lo tiene. Tampoco intenta exprimir los servidores y limitan el número de procesos que cada máquina virtual ejecuta a uno incluso cuando utilizan contenedores. ¿Por qué? Otra vez por lo mismo: porque lo que más cuesta escalar son las personas capacitadas y en estos entornos se intenta que no encuentren barreras a la hora de ser lo más productivas posibles.

Y Facebook tiene datacenters. Sus propios datacenters, un gran cloud privado. Por su foco de negocio, su tamaño y los recursos de los que dispone se los puede permitir y les independiza de lo que en el fondo son competidores suyos (Amazon, Microsoft, Google). Así que Instagram corre hoy en día en ellos tras una migración desde AWS. Pero es casi seguro que tú no tienes ni la escala ni la complejidad de Facebook en tu negocio, solo tienes la misma limitación de cerebros disponibles. Así que maximiza su productividad, no les pongas a enracar máquinas.

{{% imgur A1234J7 "Desaparecen 12 ingenieros en un DC on-premise" %}}

## En próximos capítulos

Volveremos a hablar más adelante de cada uno de los temas que han salido aquí, con detalle. Si te fijas este es uno de los primeros posts en los que me he centrado en infraestructura que no deja de ser el campo en el que estoy trabajando estos últimos años en Capside. Es mucho más interesante de lo que te pueda parecer si no te has dedicado nunca y gracias a los clouds públicos también es mucho más fácil de aprender. Ya verás, de repente te vas a sentir en Disneylandia.

Nos vemos dentro de poco ¡en programar.cloud!

## Addendum

¡Wow! Estoy súper feliz con la acogida que ha tenido el post, en serio :D Muchas gracias por todas la menciones y comentarios. Mención especial a [Pau](https://twitter.com/paxpuig) por su revisión ortográfica: lo sé, lo sé, tengo que actualizar el plugin del corrector en el VSCode :). BTW a ver si le convencéis para que escriba un blog sobre marketing modernito porque no encontraréis profesionales que sepan organizar las campañas de una empresa de servicios digitales como lo hacen él y [Emma](https://twitter.com/whiskyemms).

Gracias también a [Mathieu](https://twitter.com/Kedare), que ha escritos algunos comentarios en su tuiter sobre los que merece la pena reflexionar:

{{% tweet 936957366892941312 %}}

{{% tweet 936956994275115008 %}}

Y en general a todos los que habéis dejado un mensaje cariñoso, un retuit o un fav. ¡Dais energía!

{{% imgur twKIJJN "Who is awesome?" %}}
jv


pd: Sí, sí ¡[Marcus](https://soundcloud.com/musicbymarcus/promo-music-inspiational) ha vuelto! Y de momento parece que no cierran Soundcloud.

ppd: El [Blog de Instagram](https://engineering.instagram.com/) está súper interesante, mételo en tu feed. En partícular no te pierdas esta pieza sobre [qué tecnologías utilizan](https://engineering.instagram.com/what-powers-instagram-hundreds-of-instances-dozens-of-technologies-adf2e22da2ad).

pppd: La historia completa sobre Mike y Kevin en el podcast de [How I built this](http://www.npr.org/2016/09/19/494538482/npr-podcast-how-i-built-this-instagram).

ppppd: Un artículo explicando los [551 días que convirtieron a estos dos en millonarios](http://www.dailymail.co.uk/sciencetech/article-2128518/Instagram-The-nerds-billion-551-days-camera-app.html).

pppppd: La [filosofía de Instagram](https://es.slideshare.net/iammutex/scaling-instagram/41-our_philosophy).

ppppppd: Otro post, este sobre [la venta de Instagram a Facebook](http://highscalability.com/blog/2012/4/9/the-instagram-architecture-facebook-bought-for-a-cool-billio.html).

ppppppppd: Una presentación sobre [escalabilidad en Instagram](https://www.infoq.com/presentations/instagram-scale-infrastructure).

pppppppppd: ¡[Kevin y Mike](https://www.instagram.com/about/us/)!
