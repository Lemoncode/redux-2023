# Asincronia

## Intro


Hasta ahora todo muy bonito, pero si te fijas la acciones son 100% síncronas, tu 
tienes tu _action creator_ (la función de ayuda) y directamente devuelves un objeto que montas corriendo en el bus del dispatcher para que los reducers lo procesen.

¿Pero qué pasa si la acción es asíncrona? Algo tan tonto como hacer una llamada a una API Rest y tener que gestionar el resultado de una promesa.

Aquí podríamos esta tentados de meter en la acción la promesa, y en el reducer esperar a que vuelva, pero aquí nos meteríamos en un berenjenal: los reducers tiene que sere funciones puras, y también lo suyo es que no suelten la hebra de ejecución y den el resultado ipsofacto (si no imaginate el lío que se puede montar si la promesa tarda más en ejecutarse).

Así que nos tenemos que inventar algo, aquí el gran Dan Abramov se saco una genialidad "Redux Thunk" en 43 líneas de código.

# Pasos

Partimos del código del ejemplo anterior.

## Redux Thunk

## API de Github

### Reducer

### Thunk

# Sagas

Redux Thunk es una especie de _hack_, y para escenario simples va bien, pero hay ciertas pegas:

- Por un lado lo que inicia el Thunk no es una acción y no aparece en las devtools.
- Por otro lado hay casos avanzados que nos costaría cubrir, flujos más complejos de asincronia, como esperar a que varias acciones terminen, ejecutar varias acciones en secuencia, implementar un debounce.

Para todo esto hay algo más avanzado: Redux Saga

Si en tu proyecto legacy estás usando Sagas, puedes estar en dos escenarios:

- Que lo metieron porque _molaba_ pero en realidad no lo necesitan (Con lo que verás un código repetitivo una y otra vez).

- Que realmente lo están usando, y ahí te vas a encontrar un nivel de complejidad alto, pero nada que no se pueda sacar, primero te tienes que estudiar bien los generadores de ES6, y después las sagas.

Aquí tienes un webinar sobre Redux Saga:

https://www.youtube.com/watch?v=oljsA9pry3Q

¡ Buena suerte !
