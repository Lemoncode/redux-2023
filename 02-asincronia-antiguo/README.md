# Asincronia

## Intro

Hasta ahora todo muy bonito, pero si te fijas la acciones son 100% síncronas, tu
tienes tu _action creator_ (la función de ayuda) y directamente devuelves un objeto que montas corriendo en el bus del dispatcher para que los reducers lo procesen.

¿Pero qué pasa si la acción es asíncrona? Algo tan tonto como hacer una llamada a una API Rest y tener que gestionar el resultado de una promesa.

Aquí podríamos esta tentados de meter en la acción la promesa, y en el reducer esperar a que vuelva, pero aquí nos meteríamos en un berenjenal: los reducers tiene que sere funciones puras, y también lo suyo es que no suelten la hebra de ejecución y den el resultado ipsofacto (si no imaginate el lío que se puede montar si la promesa tarda más en ejecutarse).

Así que nos tenemos que inventar algo, aquí el gran Dan Abramov se saco una genialidad "Redux Thunk" en 43 líneas de código.

# Pasos

Partimos del código del ejemplo anterior, vamos a leer de la API Rest de Github, la lista de miembros que pertenecen a _Lemoncode_ y mostrarla por pantalla... todo pasando por Redux.

## API de Github

Esta parte no tiene que ver nada con Redux, simplemente vamos a hacer una llamada asíncrona contra una API Rest y utilizaremos la librería _axios_ para realizar la llamada.

Paramos el server local y ejecutamos el siguiente comando:

```bash
npm install axios --save
```

Volvemos a arrancar el server local

```bash
npm run dev
```

Vamos a implementar la llamada a la API de Github para obtener los miembros de una organización:

Definimos un modelo:

_./src/model/github-member.model.ts_

```ts
export interface GithubMemberEntity {
  id: number;
  login: string;
  avatar_url: string;
}
```

Y su barrel:

_./src/model/index.ts_

```ts
export * from "./github-member.model";
```

_./src/api/github.api.ts_

```ts
import axios from "axios";
import { GithubMemberEntity } from "../model/github-member.model";

const url = "https://api.github.com/orgs/lemoncode/members";

export const getMembers = (): Promise<GithubMemberEntity[]> =>
  axios.get(url).then((response) => response.data);
```

> Ojo, no uses esta estructura de carpetas para un proyecto real, si quieres ver como trabajar con estructuras: https://github.com/Lemoncode/lemon-front-estructura

### Redux Thunk

Vamos a crear una acción que se ejecutará cuando tengamos resuelta la llamada.

_./src/actions/base.actions.ts_

```diff
+ import { GithubMemberEntity } from "../model";

export enum ActionTypes {
  UPDATE_USER_NAME = "[USER_PROFILE] Update user name",
+ FETCH_MEMBERS_COMPLETED = "[MEMBERS] Fetch members completed",
}

export type BaseAction =
- {
+ |{
  type: ActionTypes.UPDATE_USER_NAME;
  payload: string;
}
+ | {
+   type: ActionTypes.FETCH_MEMBERS_COMPLETED;
+   payload: GithubMemberEntity[];
+ };
```

> Aquí es donde empieza a brillar este tipado, lo podremos comprobar en el reducer.

_./src/actions/members.actions.ts_

```ts
import { GithubMemberEntity } from "../model/github-member.model";
import { BaseAction, ActionTypes } from "./base.actions";

export const fetchMembersCompleted = (
  members: GithubMemberEntity[]
): BaseAction => ({
  type: ActionTypes.FETCH_MEMBERS_COMPLETED,
  payload: members,
});
```

Lo exportamos en el barrel:

_./src/actions/index.ts_

```diff
export * from "./base.actions";
export * from "./user-profile.actions";
+ export * from "./member.actions";
```

Y ahora el thunk para que invoque a la API y cuando se resuelva a la acción de completado:

Antes que nada tenemos que instalar el middleware de Thunk:

```bash
npm install redux-thunk --save
```

Y configurar redux thunk en el store:

_./src/App.tsx_

```diff
import "./App.css";
- import { createStore, compose } from "redux";
+ import { createStore, compose, applyMiddleware } from "redux";
import { Provider } from "react-redux";
+ import thunk from "redux-thunk";
import { rootReducer } from "./reducers";
import { UserProfileContainer } from "./user-profile";



// TypeScript: https://www.mydatahack.com/getting-redux-devtools-to-work-with-typescript/
declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

- const store = createStore(rootReducer, composeEnhancers());
+ const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));
```

> Si, redux thunk es un middleware, a partir de ahora se meterá esnifar cada acción que entre y si detecta que en vez de un objeto, es una función la ejecutará y no la pasará a los reducers (cuando termine su ejecución llamará a la acción de completado con el resultado, y está si pasará a todos los reducers).

Vamos ahora a definir la acción de Thunk

_./src/actions/members.actions.ts_

```diff
import { GithubMemberEntity } from "../model/github-member.model";
+ import { getMembers } from "../api/github.api";
+ import { Dispatch } from "redux";
import { BaseAction, ActionTypes } from "./base.actions";


export const fetchMembersCompleted = (members: GithubMemberEntity[]) => ({
  type: ActionTypes.FETCH_MEMBERS_COMPLETED,
  payload: members,
});

+ export const fetchMembersRequest = () => (dispatch : Dispatch<BaseAction>) => {
+   getMembers().then((members) => {
+     dispatch(fetchMembersCompleted(members));
+   });
+ };
```

¿Qué estamos haciendo aquí? Estamos usando una [función currificada](https://es.javascript.info/currying-partials), primero recibe los parametro que pueda recibir el action creator (en este caso ninguno, pero por ejemplo podría ser el ID de un miembo del equipo), y después thunk evaluará si ese action creator ha devuelto una función y la ejecutará, pasándole como parámetro el dispatch (el bus del dispatcher), así puedes cuando se resuelva la promesa de la llamada a la API se ejecutará la acción _fetchMembersCompleted_, esta acción ya es una acción normal y corriente (devuelve un objeto) y ReduxThunk la dejará pasar.

Un recordatorio, todo esto son piezas pequeñitas, es muy fácil meter una cagada en una y que todo el trenecito deje de funcionar y sea complicado encontrar el error, por ello:

- Es importante que tipemos todo lo que podemos (a más tipado menos errores).
- Es importante que hagamos tests unitarios (a más tests menos errores).

### Reducer

Cómo esta lista no tiene nada que ver con el perfil del usuario, vamos a crear un nuevo reducer, así vemos como podemos tener varios reducers en el store.

Primero creamos el reducer, acuérdate que sólo tiene que tratar la acción de fetch completed, porque la de start ni es una acción (es un Thunk), esto tiene la pega de que en las devtools no aparecerá.

_./src/reducers/members.reducer.ts_

```ts
import { GithubMemberEntity } from "../model/github-member.model";
import { BaseAction } from "../actions";
import { ActionTypes } from "../actions";

const handleFetchMembersCompleted = (
  _: GithubMemberEntity[],
  members: GithubMemberEntity[]
) => [...members];

export const membersReducer = (
  state: GithubMemberEntity[] = [],
  action: BaseAction
) => {
  switch (action.type) {
    case ActionTypes.FETCH_MEMBERS_COMPLETED:
      return handleFetchMembersCompleted(state, action.payload);
  }

  return state;
};
```

> EL \_ es porque no vamos a usar el primer parámetro, pero no podemos dejarlo vacío porque el compilador de TS se quejaría.

Ya tenemos el reducer, ahora lo tenemos que añadir al rootReducer:

_./src/reducers/index.ts_

```diff
import { combineReducers } from "redux";
import { UserProfileState, userProfileReducer } from "./user-profile.reducer";
+ import { GithubMemberEntity } from '../model';
+ import { membersReducer } from "./members.reducer";

export interface AppState {
  userProfile: UserProfileState;
+ members: GithubMemberEntity[];
}

export const rootReducer = combineReducers<AppState>({
  userProfile: userProfileReducer,
+ members: membersReducer,
});
```

Tipado definido y añadido al _rootReducer_.

### Componente

Ahora vamos a crear un componente que muestre la lista de miembros, para ello vamos a crear un componente funcional, que reciba los miembros como parámetro y los muestre por pantalla.

Vamos a estilarlo:

_./src/member-list/member-list.component.module.css_

```css
.container {
  display: grid;
  grid-template-columns: 80px 1fr 3fr;
  grid-template-rows: 20px;
  grid-auto-rows: 80px;
  grid-gap: 10px 5px;
}

.header {
  background-color: #2f4858;
  color: white;
  font-weight: bold;
}

.container > img {
  width: 80px;
}
```

_./src/member-list/member-list.component.tsx_

```ts
import * as React from "react";
import { GithubMemberEntity } from "../model";
import classes from "./member-list.component.module.css";

interface Props {
  members: GithubMemberEntity[];
  loadMembers: () => void;
}

export const MemberListComponent = (props: Props) => {
  React.useEffect(() => {
    props.loadMembers();
  }, []);

  return (
    <>
      <h2>Members Page</h2>
      <div className={classes.container}>
        <span className={classes.header}>Avatar</span>
        <span className={classes.header}>Id</span>
        <span className={classes.header}>Name</span>
        {props.members.map((member) => (
          <React.Fragment key={member.id}>
            <img src={member.avatar_url} />
            <span>{member.id}</span>
            <span>{member.login}</span>
          </React.Fragment>
        ))}
      </div>
    </>
  );
};
```

Vamos a crear ahora el container:

**AVISO: AQUI NOS VA A PETAR EL TIPADO DEL DISPATCH**

_./src/member-list/member-list.container.tsx_

```tsx
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { AppState } from "../reducers";
import { MemberListComponent } from "./member-list.component";
import { BaseAction, fetchMembersRequest } from "../actions";

const mapStateToProps = (state: AppState) => ({
  members: state.members,
});

const mapDispatchToProps = (dispatch: Dispatch<BaseAction>) => ({
  loadMembers: () => dispatch(fetchMembersRequest()),
});

export const MemberListContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(MemberListComponent);
```

**¡¡ Aquí nos peta el tipado !!** Por supuesto y es que ese dispatch espera una acción y no un thunk hackie :), toca crear un tipo que soporte o dispatch o thunk:

```diff
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { AppState } from "../reducers";
import { MemberListComponent } from "./member-list.component";
import { BaseAction, fetchMembersRequest } from "../actions";

const mapStateToProps = (state: AppState) => ({
  members: state.members,
});

+ // Toma leche con moloko !!
+ // Esto habría que darle una vuelta para hacerlo más elegante
+ type DispatchWithThunk = Dispatch<BaseAction> | ((arg: any) => void);

- const mapDispatchToProps = (dispatch: Dispatch<BaseAction>) => ({
+ const mapDispatchToProps = (dispatch: DispatchWithThunk) => ({
  loadMembers: () => dispatch(fetchMembersRequest()),
});
```

Exponerlo en un barrel

_./src/member-list/index.ts_

```ts
export * from "./member-list.container";
```

Y usarlo en nuestra aplicación

**./src/App.tsx**

```diff
import "./App.css";
import { createStore, compose } from "redux";
import { Provider } from "react-redux";
import { rootReducer } from "./reducers";
import { UserProfileContainer } from "./user-profile";
+ import { MemberListContainer } from "./member-list";

//  (...)

function App() {
  return (
    <>
      <Provider store={store}>
        <header>Redux 2023 - Boilerplate</header>
        <UserProfileContainer />
+        <MemberListContainer />
      </Provider>
    </>
  );
}
```

Si ahora las devtools te darás cuenta de dos cosas:

- La acción de fetchMembersRequest no aparece en las devtools, es thunk (una función) y no es acción ninguna.
- Se llama dos veces a la acción _FetchMembersCompleted_, en las ultimas versión de React, en desarrollo los componentes se montan dos veces, te aconsejan que pases de _useEffect []_ para hacer llamadas a API Rest y que uses librerías como React Query o tires de frameworks.

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
