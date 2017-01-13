---
title: Documentar un API (incluyendo Swagger)
date: 2017-01-14T08:14:20+01:00
description: "Te cuento cómo enfocar la documentación de tus web services para mantenerla siempre actualizada utilizando la solución más popular a día de hoy."
slug: como-documentar-un-api-con-swagger
draft: true
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
audio : ""
media_bytes : ""
media_duration : ""
images : []
explicit : "no"

disqus_identifier: como-documentar-un-api-con-swagger
disqus_title: Cómo documentar un API con Swagger
disqus_url: "https://programar.cloud/post/como-documentar-un-api-con-swagger"
---

{{% img src="" alt="" %}}


*TL;DR: Nos pagan por entregar valor. Invertir tiempo en crear documentos que nadie va a leer no tiene sentido pero publicar un API sin explicar cómo funciona es aún peor. Te cuento cómo encontrar el equilibrio entre ambos extremos.*

{{% archive "tests-de-integracion" %}}

## Ni contigo ni sin ti

¿Has conocido a alguien que después de un desengaño amoroso se haya convertido en un cínico o una cínica? Ya sabes, una reacción extrema de despecho. Por suerte la mayoría de estas personas terminan reequilibrándose con el tiempo y superan el trauma pero siempre hay quien no vuelve a ser persona. Algo así me pasó a mi con el tema de la documentación, luego te cuento.

Ah, y una aclaración: mi idea inicial era llamar a este post *Documentar un API sin morir en el intento* pero me temo que como SEO luce mucho menos que lo que he puesto finalmente. Así que no te extrañes si al principio parece que no voy al grano: como siempre en este blog estoy más interesado en ayudar a que crees un marco mental que a darte una implementación concreta. Pero también odio dejar las cosas en el aire, así que prometo que tendrás Swagger en algún momento.

## Razones del desamor

Pero primero déjame que para empezar te diga que usamos la misma palabra para englobar ideas bastantes distintas, como explicaba perfectamente Verónica Forqué en *Por qué lo llaman amor cuando quieren decir Sexo*(TODO). Es lo que nos pasa con la palabra *documentación*: engloba temas tan dispares como los requerimientos de la aplicación, los comentarios en el código o la información sobre las rutas que publican tus operaciones y los parámetros que necesitan.

¿Recuerdas {{ilink "devops-en-serio" "mi proyecto infierno"}}? En él hicimos una aproximación clásica a la documentación del análisis y terminamos generando cientos y cientos de páginas de texto que no guardaban ninguna coherencia entre ellas *antes* de probarlas con código.

A ti también te ha pasado: seguramente haces años te despertaste un día y dijiste "umh... me pregunto cuando terminaré haciendo un análisis gramatical de una oración subordinada o aplicando UML en un proyecto". Porque durante todos los años de tu formación dedicaron una cantidad energía increíble al Unified Modeling Language](TODO!) hasta el punto de que realmente salíamos creyendo que íbamos a invertir nuestra vida en hacer estos dibujitos. Es posible que ni siquiera los hayas vuelto a utilizar y si lo has hecho espero que haya sido en el contexto para el que realmente son útiles: comunicar ideas entre el equipo de desarrollo.

Como te decía con este tipo de desengaños llega el cinismo: el "la documentación no sirve para nada, es una pérdida de tiempo" fue mi *motto* durante unos meses cuando me largué de ese proyecto maldito. Fíjate bien, no es que me quejase de que no me apetecía documentar o que no tenía tiempo para hacerlo. Es que estaba convencido de que realmente afectaba de manera negativa al progreso del proyecto y generaba confusión en lugar de reducirla. Primero porque reducía las oportunidades de comunicación entre el equipo al convertir el "míralo en la doc" en una coletilla recurrente, segundo porque resultaba inabarcable y por lo tanto incoherente y tercero (y este fue realmente el causante de varios dramas) porque la sincronización entre el papel y la implementación difería cada vez más.

Por ello, durante bastante tiempo defendí a capa y espada que la mejor documentación es el código. Estaba equivocado, claro.

## No eres tú, soy yo

Por supuesto estaba equivocado. Y no porque no reconociese correctamente los problemas si no porque la solución que defendía era pueril. En realidad una excelente documentación es imprescindible y lo realmente importante es ser efectivo a la hora de crearla. No todos los docs que creas tienen la misma finalidad así que puedes aplicar distintas tácticas para cada grupo de ellos.

### Visión global

Necesitas poder explicar a los demás en qué consiste tu proyecto, qué problema soluciona. ¿Sabes quién va a reelerlo más a menudo? Exacto, tú. Te va a servir para mantener la visión y el foco. Para recordarte qué es prioritario y qué es accesorio.

Y puedes escribir un libro sobre ello (que nadie va a leer) o generar un pequeño ```README.md``` en la raíz del código. [Markdown](TODO!) ftw.

### Requerimientos

Para empezar, en la mayoría de los proyectos no tiene ningún sentido invertir semanas o meses en definir hasta el último detalle los requerimientos del sistema: es infinitamente más práctico tener acceso al cliente (a través de la figura del *product owner*, por ejemplo) para ir pidiendo aclaraciones de los detalles a medida que se necesita. Esta información puede terminar plasmándose en [historias de usuario](TODO!) con un formato de ficha muy sencillo y manejable.

{{% imgur "" "Una historia de usuario" %}}

Desde luego esto solo vas a poder aplicarlo si sigues una metodología de venta y desarrollo basada en algún framework ágil, intentaré hablar sobre esto cuanto antes.

### Documentar el código

Se trata de hacer más fácil su lectura, de conseguir que sea sencillo entender cada pieza. La clave aquí es la sincronización entre la documentación y el código en sí y la única manera de conseguirlo es incrustándola. De esta manera si modificas una parte del código puedes en ese mismo momento actualizar la documentación.

Hoy en día cualquier plataforma te permite hacerlo pero la primera que realmente popularizó este mecanismo fue Java. La idea es que puedes añadir antes de casi cualquier elemento del programa un comentario enmarcado entre ```*//```y ```*/``` y una herramienta llamada ```javadoc``` es capaz de analizar los ficheros java y generar en base a ello una serie de páginas HTML. Algo que ya no valoramos como se merece es que como la herramienta conoce las relaciones que hay entre las diferentes estructuras del código toda la documentación está hiperenlazada entre ella con lo que es muy fácil averiguar más detalles sobre por ejemplo el tipo del parámetro de una rutina.

Ya veremos que puedes usar ```maven``` para ejecutar ```javadoc``` con lo que la generación de la documentación técnica formará parte de tu proceso de integración continua.

Te pongo un ejemplo, a ver qué te parece:

```java
/** Representa un marcianito. */
public class Marcianito extends Sprite {
  /** Identificador del marciano. */
  private int id;

  /** Velocidad a la que se desplaza */
  private double velocidad;

  ...
}
```

¿Cómo lo ves? Exacto. **Pura basura**. Estás escribiendo dos veces lo mismo, en castellano y en Java. En lugar de seguir el principio de [don't repeat yourself (DRY)](TODO!) explicas algo que debería ser obvio. Es una documentación totalmente inefectiva. En cambio esto tendría mucho más sentido:

```java
/** Los marcianitos representan a los enemigos en el juego. */
public class Marcianito extends Sprite {
  /** El id se autoasigna al guardarse en la base de datos. */
  private int id;

  /** Velocidad a la que se desplaza en metros por segundo */
  private double velocidad;
}
```

Ahora sí estamos aportando datos que facilitan comprender la estructura del código. Y aún habría sido mejor eliminar el último comentario, para ello solo tienes que cambiar el nombre de la variable a ```private double velocidadMetrosPorSegundo```. Y esto tiene el efecto adicional de que estás documentando esa variable aparezca donde aparezca, no solo en su definición: cuando encuentras la línea ```velocidadMetrosPorSegundo = velocidadMetrosPorSegundo + 1``` sabes exactamente que está pasando. Sí, al final es cierto: si está bien escrito el código es la mejor documentación. Pero no la única.

### API

Ya estamos llegando a donde queríamos. ¿Qué hacemos con el API de nuestro web service? ¿Qué hacemos con los servicios REST? Tenemos que documentar los recursos que manipulamos, las operaciones que definimos a su alrededor, los parámetros que precisan, el resultado que obtenemos. ¿Cómo lo hacemos?

En este post voy a enseñarte cómo se utiliza Swagger para este trabajo. Es un proyecto TODO! y aunque existen varias alternativas como [TODO!] hoy por hoy sigue siendo la más popular con mucha diferencia.

Para empezar plantéate quién es el usuario de tu API. Exacto: otro programador. Tienes que crear una documentación adecuada para este perfil. Por un lado es una documentación técnica (no muy diferente a la que genera ```javadoc```) pero también estás describiendo un contrato: quien la utilice está construyendo un producto sobre ella y por lo tanto espera que sea totalmente estable.

Y aquí es donde en el fondo tienes dos posibles caminos. El primero (*bottom up**) es añadir la documentación de tu API al código. Tiene un clarísimo efecto positivo que es la localidad (la implementación está al lado de la documentación) con la facilidad de mantenimiento que ello implica. Pero también tiene el problema de que al estar mezclada con las líneas de tu lenguaje de programación favorito resulta difícil ver la evolución de posibles cambios mediante un simple ```diff``` en tu sistema de control de versiones.

La alternativa obvia es el *top down*: definir el contrato usando la sintaxis específica del producto que decidas utilizar usando lo que en el fondo es un lenguaje de programación declarativo y generar a partir de ese documento el código de tus controladores. Si quieres que este enfoque funcione tienes que utilizar herramientas que lo automaticen, en caso contrario siempre van a haber discrepancias.

El segundo método parece más elegante y desde luego hace mucho más fácil tracear la evolución del contrato por el simple método de hacer un diff entre dos versiones del fichero que declara el API. Además es fácil generar esqueletos de los controladores. Por otro lado supone un elemento más en tu proyecto y lo cierto es que no soy en absoluto partidario de los generadores de código: por muy cuidadoso que seas cada vez que regeneras el esqueleto (porque has hecho un cambio en el contrato) estás sobrescribiendo código que posiblemente ya has modificado previamente. 













--
