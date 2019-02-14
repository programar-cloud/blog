---
title: "Cambiar firmware de Sonoff por wifi - IoT"
date: "2018-09-28"
description: "¡Por fin! Cómo flashear el firmware de tus dispositivos sonoff de la forma más sencilla posible sin necesidad de soldar."
slug: cambiar-firmware-sonoff-wifi
draft: false
tags:
- iot
- sonoff
- smarthomes
- flash
- firmware
temas:
- IoT
niveles:
- Medio

episode : "43"
audio : ""
media_bytes : ""
media_duration : ""
images : ["https://programar.cloud/media/2000-blue-bulbs.jpg"]
explicit : "no"

disqus_identifier: cambiar-firmware-sonoff-wifi
disqus_title: "Cambiar firmware de Sonoff por wifi - IoT"
disqus_url: "https://programar.cloud/iot/cambiar-firmware-sonoff-wifi"
---      

{{% youtube "gvenIMoqptI" %}}

¡De vuelta como prometimos! Me temo que esta vez no tiene mucho sentido que publique el capítulo como podcast porque es demasiado visual para poder seguirlo sin el vídeo, así que no dejes que te venza la pereza y dale al play en youtube.

Hoy toca **cambiar el firmware del sonoff** para que podamos controlarlo sin necesidad de utilizar la App oficial y el (muy limitado) servicio cloud de *eWeLink*.

Los links que aparecen en el vídeo son:

* [Let's control it](https://www.letscontrolit.com/wiki/index.php/Sonoff_Touch) con un tutorial paso a paso sobre cómo cambiar el firmware al *Touch* soldando
* [SonOTA](https://github.com/mirko/SonOTA/releases) para flashear tu *Sonoff* utilizando la wifi. Y sí, sí: me he pasado medio capítulo pronunciando *sonata* en lugar de *sonota* ;-)
* [Tasmota](https://github.com/arendst/Sonoff-Tasmota), la rom que instala *SonOTA* por defecto
* [Fing](https://play.google.com/store/apps/details?id=com.overlook.android.fing&hl=es), el escáner de red con el que echarás unas risas

Y recuerda: en la parte izquierda del blog tienes un montón de botoncitos para demostrar tu amor. Comparte el capítulo, que no te cuesta más que un click y hará que sea útil para más gente :)
<!--more-->

jv

pd: ¿Por qué cambiar la música de la entradilla si la de [Marcus](https://soundcloud.com/musicbymarcus/promo-music-inspiational) nos hace sonreír?

ppd: ¡Ojo! No sabía que Espurna puede [instalarse directamente con sonOTA](https://github.com/xoseperez/espurna/wiki/OTA-flashing-of-virgin-Itead-Sonoff-devices). Si lo haces, te ahorras el siguiente paso.