# Redux 2023

## ℹ️ ¿Qué es esto?

Redux fue una tecnología muy popular, entre 2016 y 2019, después cayó en desuso ya que se utilizo para escenarios donde no aplicaba.

Si has llegado aquí es porque:

- Seguramente te haya tocado un mantenimiento (¡Buena suerte compañero!).
- Igual has encontrado un proyecto en el que puede aplicar.

¿Qué te puedes encontrar en este repo? Unas demos básicas de como se utilizaba Redux en 2016-2019 (seguramente el proyecto en el que hayas caído), y otras utilizando Redux Toolkit 2019-... (seguramente no estés usando esto en el proyecto y no te dejen).

Son demos muy básicas, cada una de las demos tiene una guía paso a paso (readme.md) para que las puedes hacer desde cero, también se incluyen explicaciones y referencias a librerías adicionales que se usaban en su día.

## 🌋 ¿Por qué un proyecto Redux dicen que es un infierno?

Redux y Redux Toolkit son soluciones buenas para escenarios concretos.

¿Qué paso entre 2016-2019? Pues que al principio React no tenía maduro su contexto, y los desarrolladores nos _flipamos_ mucho con Redux y lo usamos para escenarios que no aportaban nada, más bien al revés... metíamos un montón de complejidad y código en el proyecto para resolver problemas sencillos.

> Un martillo es una herramienta estupenda... siempre y cuando no la utilices para matar moscas.

¿Qué pasa ahora?

- Qué hay bases de código enormes que están escritas con Redux.
- Que estás bases de código ya no son fáciles de migrar, ni si quiera a Redux Toolkit.
- Que encima por ese código han pasado muchos desarrolladores que no conocían como funcionaba la librería y han dejado unos pufos considerables.
- Que un desarrollador con la seniority suficiente como para poder gestionar ese código... no va a querer trabajar en ese proyecto y se va a ir a otra empresa (el perfil del _arquitecto_ itinerante, te dejo el pufo y me voy a por el siguiente hype)

## 📔 Los ejemplos

Que ejemplos te puedes encontrar en este repositorio:

- **00-boilerplate**: este es un punto de partida, una aplicación React que dice eso de "hola mundo".

- **01-hola-redux-antiguo**: aquí montamos un ejemplo básico con Redux (sin Redux Toolkit), mostramos un nombre y el usuario lo puede cambiar (esto de enlazar el cambio de un input a redux es algo que ahora no se aconseja, pero en el pasado era muy normal, de hecho de llego a usar una librería para gestión de formularios redux-form).

- **02-asincronia-antiguo**: Este ejemplo parte de 01-hola-redux-antiguo, aquí lo que hacemos es gestionar acciones asíncronas para ello utilizamos la librería redux-thunk, un hack para gestionar asincronia (que por cierto no aparecía en las devtools de redux), también podrás encontrar enlaces con información sobre redux-saga (otra librería para gestionar asincronia, que si la tienes en tu proyecto, preparate para asumir una carga de complejidad, toca empezar por aprender lo que son generadores en JavaScript).

- **03-redux-toolkit**: Este ejemplo parte de _00-boilerplate_, aquí lo que hacemos es recopilar la funcionalidad del ejemplo 01 y 02 (editar nombre y listado de usuarios de Github) y vemos como se hace esto siguiendo la guía del Toolkit, como verás es menos código, se organiza todo mejor, pero... en algunos momentos nos dará la sensación de que estamos usando magia.

## 👣 Pasos a futuro

Dependiendo del tirón que tenga este repo, estamos planteando montar más ejemplos:

- Armar los ejemplos de forma que se pueda desarrollar de manera progresiva (ver resultados desde el minuto cero e ir evolucionando).
- Armar un juego sencillo de tablero y o un editor de diagramas sencillo y ver que tal se porta redux (incluyendo patrones como undo/redo, ...)
- Montar un ejemplo con sagas.

## 📚 Referencias

[Redux Toolkit TypeScript](https://redux-toolkit.js.org/usage/usage-with-typescript)

[Reselect](https://github.com/reduxjs/reselect)

[Redux Sagas en español](https://www.youtube.com/watch?v=oljsA9pry3Q&t=1s)

# 👩‍🎓 ¿Te apuntas a nuestro máster?

Si te ha gustado este ejemplo y tienes ganas de aprender Front End guiado por un grupo de profesionales ¿Por qué no te apuntas a nuestro [Máster Front End Online Lemoncode](https://lemoncode.net/master-frontend#inicio-banner)? Tenemos tanto edición de convocatoria con clases en vivo, como edición continua con mentorización, para que puedas ir a tu ritmo y aprender mucho.

También puedes apuntarte a nuestro Bootcamp de Back End [Bootcamp Backend](https://lemoncode.net/bootcamp-backend#inicio-banner)

Y si tienes ganas de meterte una zambullida en el mundo _devops_ apúntate nuestro [Bootcamp devops online Lemoncode](https://lemoncode.net/bootcamp-devops#bootcamp-devops/inicio)
