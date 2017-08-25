---
title: "Balanceadores de carga"
date: 2017-07-29
description: "En este post te cuento cómo desacoplar capas de tu aplicación y distribuir la carga que reciben los nodos."
slug: balanceadores-de-carga
draft: true
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

episode : "29"
video : ""
media_bytes : ""
media_duration : ""
images : [""]
explicit : "no"

disqus_identifier: balanceadores-de-carga
disqus_url: "https://programar.cloud/post/balanceadores-de-carga"
disqus_title: Balanceadores de carga
---
{{% img src="/media/1130-avengers-wikipedia.jpg" alt="¡Vengadores, reuniros!" %}}

*TL;DR: El truco básico para conseguir escalar es añadir más hierro, no hierro más grande. Y cuando lo haces la forma más sencilla de distribuir el tráfico es utilizar balanceadores de carga.*

{{% archive %}}

Incluso si tu aplicación es un gran monolito estoy seguro de que la tendrás estructurada en al menos tres capas físicas: el cliente (¿un navegador?), el servidor (¿quizá JBoss?) y la base de datos (Oracle, por qué no, que arda todo, busquemos el dolor).

Vamos a empezar por este escenario sencillo y veremos qué pasa conforme añadimos complejidad ¿de acuerdo? Ojo, que no nos vamos quedar en lo obvio. Andando.<!--more-->

## La historia de Kevin

Kevin empezó a trabajar en Google justo después de terminar la universidad. Un tío feliz, trabajando en proyectos como Google Reader. Sí, sí: esa aplicación que amaste cuando te enteraste de que existía, aproximadamente diez minutos antes de que la cerrasen.

Era 2010 y Kevin estaba echando la tarde bebiendo una cerveza con su amigo Mike y comentando la noticia de que Facebook compraba una startup llamada NextStop [por 2.5 millones de dólares](https://www.quora.com/How-much-did-Facebook-pay-to-acquire-NextStop). "Tiiiiiiiío, qué pasta, con eso me iba a vivir a (TODO! residencia). Tendríamos que hacer algo así." le dijo.

Y se pusieron a ello. Básicamente empezaron a montar un clon de NextStop llamado Burbn porque era 2010 y las vocales costaban un dinero cuando querías comprarlas para tu dominio.

## Balanceando la carga del servidor

Lo primero que tendrás en cuenta desde el principio es que el número de usuarios de tu aplicación no va a ser constante a lo largo de los días ni Hay un gráfico maravilloso que explica la complejidad asociada a los sistemas distribuidos. Déjame que te lo enseñe:

![Complejidad sistemas distribuídos](TODO! gráfico)

### Mediante DNS
### Con un balanceador de carga
### Alta disponibilidad y escalado
### Principales sospechosos

## Añadiendo una capa estática

## Moviéndonos a microservicios

## Balanceando peticiones asíncronas







http://www.npr.org/2016/09/19/494538482/npr-podcast-how-i-built-this-instagram




.
