# Asincronia

## Intro

Hasta ahora todo muy bonito, pero si te fijas la acciones son 100% síncronas, tu
tienes tu _action creator_ (la función de ayuda) y directamente devuelves un objeto que montas corriendo en el bus del dispatcher para que los reducers lo procesen.

¿Pero qué pasa si la acción es asíncrona? Algo tan tonto como hacer una llamada a una API Rest y tener que gestionar el resultado de una promesa.

Aquí podríamos esta tentados de meter en la acción la promesa, y en el reducer esperar a que vuelva, pero aquí nos meteríamos en un berenjenal: los reducers tiene que sere funciones puras, y también lo suyo es que no suelten la hebra de ejecución y den el resultado ipsofacto (si no imaginate el lío que se puede montar si la promesa tarda más en ejecutarse).

Así que nos tenemos que inventar algo, aquí el gran Dan Abramov se saco una genialidad "Redux Thunk" en 43 líneas de código.

# Pasos

Partimos del código del ejemplo anterior, vamos a leer de la API Rest de Github, la lista de miembros que pertenecen a Lemoncode y mostrarla por pantalla... todo pasando por Redux.

## API

Vamos a implementar un método para leer los miembros de una organización de Github, para ello vamos a usar la API Rest de Github:

_./src/api/github.api.ts_

```ts

```

> Ojo, no uses esta estructura de carpetas para un proyecto real, si quieres ver como trabajar con estructuras: https://github.com/Lemoncode/lemon-front-estructura

## Redux Thunk

Vamos a instalar Thunk

Vamos a crear una acción que se ejecutará cuando la acción se resuelva:

Y ahora el thunk para que invoque a la API y cuando se resuelva a la acción de completado

## API de Github

Esta parte no tiene que ver nada con Redux, simplemente vamos a hacer una llamada asíncrona contra una API Rest y utilizaremos la librería _axios_ para realizar la llamada.

```bash
npm install axios --save
```

Vamos a implementar la llamada a la API de Github para obtener los miembros de una organización:

Definimos un modelo:

_./src/model/github-members.model.ts_

```ts
export interface GithubMemberEntity {
  id: number;
  login: string;
  avatar_url: string;
}
```

_./src/api/github.api.ts_

```ts
import axios from 'axios';
import { GithubMemberEntity } from '../model/github-member.model';

const url = 'https://api.github.com/orgs/lemoncode/members';

export const getMembers = () : Promise<GithubMemberEntity[]> => axios.get(url).then((response) => response.data);
```

### Thunk

Vamos a crear una acción que se ejecutará cuando tengamos resuelta la llamada.

_./src/actions/base.actions.ts_

```diff

```

_./src/actions/members.actions.ts_

```ts
import { GithubMemberEntity } from '../model/github-member.model';

export const fetchMembersCompleted = (members: GithubMemberEntity[]) => ({
  type: 'FETCH_MEMBERS_COMPLETED',
  payload: members,
});
```


### Reducer



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

# Por qué todo esto se fue al carajo

Redux es un patrón interesante, que sobre el papel aporta muchas ventajas.

En cuanto te pones a implementar un proyecto real, te das cuenta de que hay que picar mucho código, y son muchas piezas las que tienes que encajar, y que si no tienes un equipo con un nivel alto de conocimiento, es muy fácil que se te vaya de las manos.

Por otro lado no todo los proyectos encajan en esta filosofía (overkill) y también programarlo en modo antiguo era muy duro, después salió Redux toolkit y se simplificó mucho la cosa, pero ya era tarde.

A fecha de hoy tirando de React Context y Prop Drill puedes resolver un montón de aplicaciones sin meterte en estas complejidades.

Aquí esta la labor del arquitecto de software, saber que tecnología encaja en que proyecto y no usarla porque sí.
