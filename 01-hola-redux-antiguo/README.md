# Hola Redux Antiguo

## Intro

Seguramente si estás buscando como loco información acerca de Redux, es que hayas caído en un mantenimiento, y no usen la última versión de Redux, ni Redux Toolkit.

Así que vamos a arrancar por crear un proyecto a la antigua y comentar que es cada cosa.

# Pasos

- Copiate el proyecto de la carpeta _00-boilerplate_ y ejecuta:

```bash
npm install
```

```bash
npm run dev
```

En el terminal te indicará en que puerto se va a lanzar la aplicación de ejemplo (normalmente _localhost:5173_).

## Instalando Redux

En proyecto antiguos seguramente tengas instalado Redux y los Typings de Redux, tenías que hacer custro install (el de redux y el de @types/redux y el de react-redux y sus typings).

Si te instalas redux ahora verás que no hace falta.

```bash
npm install redux react-redux --save
```

> ¿Por qué redux y react-redux? Redux es la implementación en JavaScript puro, y react-redux toma como base ésta y le añade la fontanería para que funciona con React.

## El ejemplo mínimo

Vamos a montar un ejemplo mínimo (que sería un overkill...), vamos a mostrar un nombre de usuario y también vamos a dejar que el usuario lo edite.

### Paso 1 creando el store

En Redux el estado de la aplicación se guarda en un objeto llamado _store_, para crearlo tenemos que usar la función _createStore_.

Peeero... la cosa no es tan fácil como _crea el store y fuera_ el estado lo vamos a dividir en islas separadas y cada isla va a tener una función que llamaremos _reducer_ que nos permitirá actualizar el estado de esa isla.

> Esa función se llama _reducer_ porque acepta dos parámetros (la foto del estado que había hasta ese momento, y la acción que se quiere ejecutar) y devuelve un nuevo estado (es decir reduce de dos parámetros de entrada a uno de salida).

Así que queremos almacenar el nombre del usuario en un estado, ¿Qué vamos a hacer?

- Crear un interfaz que defina ese estado.
- Usarlo en un reducer
- Añadir al store (es decir al almacen de estados).

Para verlo paso a paso vamos crear una estructura de carpetas sencilla (en un proyecto real habría que plantear otra).

_./src/reducers/user-profile.reducer.ts_

```typescript
export interface UserProfileState {
  name: string;
}

export const createDefaultUserProfile = (): UserProfileState => ({
  name: "Sin nombre",
});
```

Es decir aquí:

- Definimos un trozo de estado de la aplicación (interfaz UserProfileState).
- También definimos un un método que nos permite crear un estado por defecto (createDefaultUserProfile).

Vamos ahora a por el reducer (en el mismo fichero):

** Añadir al final \***

```tsx
export const userProfileReducer = (
  state: UserProfileState = createDefaultUserProfile(),
  action: any
) => {
  return state;
};
```

¿Qué estamos haciendo aquí? De momento poca cosa

- Recibimos el estado actual de la aplicación, que si de primeras es null o undefined, llamar a _createDefaultUserProfile_ para crear un estado por defecto (que va a contener en el campo _name_ el valor _Sin nombre_).
- Devolvemos justo el mismo estado.

> ¿Por qué hacemos esto? Porque en Redux no se puede devolver un estado null o undefined, siempre tiene que haber un estado, y ... ¿Cómo lo modificamos? Ya lo aprenderemos más adelante.

Siguiente paso, ya tenemos un trozo de estado y una función que nos servirá para almacenar la información, tenemos que guardarlo todo en el gran almacén de nuestra aplicación (el _Store_ de redux).

_./src/reducers/index.ts_

```typescript
import { combineReducers } from "redux";
import { UserProfileState, userProfileReducer } from "./user-profile.reducer";

export interface AppState {
  userProfile: UserProfileState;
}

export const rootReducer = combineReducers<AppState>({
  userProfile: userProfileReducer,
});
```

¿Qué estamos haciendo aquí?

- Creamos un interfaz que nos servirá para definir el estado de la aplicación (AppState), ahí podemos guardar un montón de trozos de estado, por ejemplo el perfil de usuario, el carrito de la compra, etc...

- Creamos un reducer que nos servirá para actualizar el estado de la aplicación (rootReducer), en este caso sólo tenemos un trozo de estado, pero podríamos tener muchos más.

- En ese reducer de momento va a estar nuestro _userProfileReducer_.

> Si te fijas lo hemos creado en el fichero _index.ts_ así a la hora de importarlo sólo tenemos que referenciar la carpeta _reducers_.

### Creando el store

Ya tenemos todos los reducers y trozos de estado listo, nos queda crear el gran almacén (el store), y engancharlo en el ciclo de vida de React (para ello definimos un _Provider_ en el nivel más alto de la aplicaión, así desde cualquier punto de la aplicación podremos acceder al mismo).

Para ello en _./src/index.ts_ lo definimos:

_./src/app.tsx_

```diff
import "./App.css";
+ import { createStore } from "redux";
+ import { Provider } from "react-redux";
+ import { rootReducer } from "./reducers";

+ const store = createStore(rootReducer);

function App() {
  return (
    <>
+    <Provider store={store}>
      <header>Redux 2023 - Boilerplate</header>
      <main>Aquí van las demos..</main>
+    </Provider>
    </>
  );
}

export default App;
```

> Aquí te aparecerá que _createStore_ está deprecated, pero es que estamos usando la versión antigua de Redux, así que no te preocupes (después usaremos la moderna)

Si ejecutamos podemos ver que... bueno el código no peta pero no hay nada :D, primera lección de Redux, vas a picar mucho código sin ver resultados :D.

Antes de meternos a hablar de acciones, contenedores y hooks, vamos a insertar unas devtools que nos permitirán ver el estado de la aplicación en cada momento (así al menos podemos ver que se ha enganchado todo correctamente).

Para ello tienes que instalarte la extensión de redux dev tools en tu navegador favorito.

Para Chrome la puedes encontrar aquí:

https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=es

Si volvemos a ejecutar... tampoco se ve nada, Ooops, hay que hacer un paso de fontanería para enlazarlo

Te presento a los _middlewares_ que con extensiones que puedes añadir a Redux para enseñarle trucos nuevos, ¿Cómo funcionan? Se meten en medio del flujo de redux y las acciones y demás pasan por ellos, estos middlewares pueden o bien dejar pasar la acción, o bien modificarla, o bien hacer algo con ella.

Para configurar esto (en modo antiguo) con las dev tools haremos lo siguiente:

_./src/App.tsx_

```diff
import "./App.css";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { rootReducer } from "./reducers";

+ // TypeScript: https://www.mydatahack.com/getting-redux-devtools-to-work-with-typescript/
+ declare global {
+  interface Window {
+    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
+  }
+ }
+
+ const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
+
const store = createStore(rootReducer
+ ,composeEnhancers()
);
```

¿Qué estamos haciendo aquí? Tenemos que liarla un poco más de la cuenta para cumplir con los tipos y el tipo estricto de TypeScript (si no estás en modo estricto, esta solución te vale también)

- Primero, vamos a acceder al objeto global _Windows_ ¿Qué pasa? Que ese objeto en TypeScript no tiene una llamada _REDUX_DEVTOOLS_EXTENSION_COMPOSE_ así que tenemos que declararla (y decirle que es una función que devuelve el tipo de _compose_ de redux).

- Segundo chequeamos si existe (si no están las redux dev tools instaladas nos devuelve undefined), así que si lo está usamos el compose de las devtools, si no el compose que trae redux.

- Despues añadimos ese middleware al store.

- Primero comprobar si están instaladas las _devtools_ de redux (si lo están hay una variable global en el objeto _window_ del navegador que se llama '**REDUX_DEVTOOLS_EXTENSION**'.
- En caso de que exista la añadimos como middleware a nuestro store (de ahí que lo invoquemos como función).

> A tener en cuenta: en producción igual no queremos que esto aparezca, así que te hará falta en un proyecto real comprobar si estás haciendo build para producción o desarrollo para activarlo o desactivarlo (como curiosidad aplicaciones como _slack_ o _bitbucket_ estaban por defecto conectadas a las devtools en producción).

Si ejecutamos ahora, veremos que en la pestaña de Redux de las devtools aparece un estado inicial de la aplicación.

```bash
npm run dev
```

### Contenedores y componentes

Ahora estarás pensando... _muy bonito, lo veo en las devtools, pero yo quiero mostrar el nombre por pantalla..._ vamos a seguir con redux _antiguo_ y a crear unos contenederos que nos permitan acceder al estado de la aplicación.

¿Esto que es?

- Tengo redux y un store con el estado de la aplicación.
- ¿Cómo accedo al mismo?
  - Con redux antiguo usando un container que me permite conectar estado y acciones (las acciones las veremos luego).
  - Con redux moderno, existen los hooks que nos permiten acceder al estado y a las acciones (quizás si esto hubieses existido de primeras nos habría hecho la vida más fácil :))

Así que lo que vamos a hacer es crear lo siguiente:

- Una carpeta en la que almacenaremos todo nuestro código relacionado con editar un perfil (interfaz de usuario).
- Un contenedor que conecte los datos que tenemos en el store y se lo pase al componente hijo que será el que presente la información.
- Un componente que tenga la lógica para mostrar el nombre del usuario (más adelante permitiremos editar el nombre).

Vamos a ello:

Primero el componente presentacional:

_./src/user-profile/user-profile.component.tsx_

```typescript
import React from "react";

export interface UserProfileProps {
  name: string;
}

export const UserProfileComponent: React.FC<UserProfileProps> = ({ name }) => {
  return (
    <>
      <h2>User Profile</h2>
      <div>
        <label>Nombre:</label>
        <span>{name}</span>
      </div>
    </>
  );
};
```

¿Qué hacemos aquí?

- Le decimos que esperamos que el padre nos de una propiedad _name_ (el nombre del usuario) y la mostramos).
- Fíjate que aquí no hay nada de redux, ni store, ni nada, es un componente que recibe una propiedad y la muestra.
- Puedes pensar en las pelís de Narcos, este componente es el "pringao" que no conoce nada del negocio, sólo sabe que le pasan mercancia y la vende.

Vamos ahora a por el contenedor:

- En Redux antiguo se utilizaba la función _connect_ que nos permitía conectar el estado y las acciones con el componente.
- Este _connect_ es un High Order Component (HOC), si no sabes lo que es eso, te has librado de una buena :), si estás en un proyecto muy antiguo de React, aquí puedes estudiarlo: https://legacy.reactjs.org/docs/higher-order-components.html
- Aquí le decimos que del estado del store, nos quedamos con la propiedad _name_ y se la pasamos al componente _UserProfileComponent_.

_./src/user-profile/user-profile.container.tsx_

```typescript
import { connect } from "react-redux";
import { UserProfileComponent } from "./user-profile.component";
import { AppState } from "../reducers";

const mapStateToProps = (state: AppState) => ({
  name: state.userProfile.name,
});

export const UserProfileContainer =
  connect(mapStateToProps)(UserProfileComponent);
```

_./src/user-profile/index.ts_

```typescript
export * from "./user-profile.container";
```

Vamos ahora a usar ese contenedor en nuestro componente principal:

_./src/App.tsx_

```diff
import { createStore, compose } from "redux";
import { Provider } from "react-redux";
import { rootReducer } from "./reducers";
+ import { UserProfileContainer } from "./user-profile";

// TypeScript: https://www.mydatahack.com/getting-redux-devtools-to-work-with-typescript/
declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(rootReducer, composeEnhancers());

function App() {
  return (
    <>
      <Provider store={store}>
        <header>Redux 2023 - Boilerplate</header>
-        <main>Aquí van las demos..</main>
+        <UserProfilecontainer/>
      </Provider>
    </>
  );
}
```

Vamos a verlo en funcionamiento.

¿Y para esto tanto lío? Bueno si... esto sólo le verás beneficios en cierto tipo de aplicaciones, en teoría lo que ganamos:

- Separamos estado de interfaz de usuario.
- Tenemos un sólo sitio donde se almacenan los datos de la aplicación.

... Bueno y más cosas bonitas que después veremos que en la práctica hace que tengas un desarrollo pesado (salvo que estés en un escenario donde el patrón te aporte, pista... una aplicación de gestión de toda la vida no suele ser buen sitio para usar Redux)... en cuanto hayamos completado este tutorial básico, nos mojaremos y pondremos algunos ejemplos de aplicaciones en lo que si que puede tener sentido usar Redux.

### Acciones y dispatch

Ya sabemos como mostrar datos en pantalla, pero... ¿Cómo los modificamos?

Ahora vienen las acciones y el dispatch ¿Qué es esto?

Empecemos por las acciones:

- Cuando quiero modificar un dato, soy un tipo ordenador y defino una _acción_ es acción no es otra cosa que un interfaz con una estructura, suele tener dos campos:
  - El ID de la acción, así sabemos que vamos a hacer (por ejemplo _UPDATE_USER_NAME_).
  - El payload de la acción, es decir que valores tengo que incluir para modificar el estado (por ejemplo el nuevo nombre del usuario), este payload puede tener cualquier estructura, por ejemplo podría ser la ficha de un cliente.

Todo esto está muy bien ¿Pero como meto una acción en el flujo de Redux?

Vamos a utilizar una analogía para explicar esto:

- Imagínate que quieres ir la trabajo.
- La empresa te pones una "lanzadera" (Que no deja ser un autobus que va recogiendo empleados y los deja en la puerta de la oficina).
- Esa lanzadera te recoge y te lleva hasta allí... ala a currar como un campeón

Pues bien el pobre diablo que va a trabajar es la acción.

El autobus que va recogiendo trabajadores es el dispatcher.

Así pues vamos a definir un acción que nos permita modificar el nombre del usuario:

Primero definimos un tipo base para las acciones (de momento tiramos de _any_ para el payload, despues tiraremos más info ¿Por qué _any_ porque en una aplicación tendremos multiples acciones y cada una tendrá un payload diferente, así que no podemos definir un tipo base para todas... bueno después veremos un truco).

_./src/actions/base.actions.ts_

```typescript
export interface BaseAction {
  type: string;
  payload: any; // Aupa el any !!
}
```

Y ahora la acción que nos permite modificar el nombre del usuario, vamos a usar una función que nos ayude a crearla (a esta función tan tonta se le da el rimbombante nombre de _action creator_).

_./src/actions/user-profile.actions.ts_

```typescript
import { BaseAction } from "./base.actions";

export const UPDATE_USER_NAME = "[USER_PROFILE] Update user name";

export const createUpdateUserNameAction = (name: string): BaseAction => ({
  type: UPDATE_USER_NAME,
  payload: name,
});
```

Vamos a crear un barrel para agrupar todo esto

_./src/actions/index.ts_

```typescript
export * from "./base.actions";
export * from "./user-profile.actions";
```

Ya tenemos la acción, fíjate que le hemos puesto un prefijo ¿Por qué? Porque estas acciones pasan por todos los reducers, y si no ponemos un prefijo, podríamos tener colisiones de nombres.

Vamos ahora a usarla en nuestro reducer:

_./src/reducers/user-profile.reducer.ts_

```diff
+ import { BaseAction } from "../actions";

export interface UserProfileState {
  name: string;
}

export const createDefaultUserProfile = (): UserProfileState => ({
  name: "Sin nombre",
});

export const userProfileReducer = (
  state: UserProfileState = createDefaultUserProfile(),
-   action: any
+   action: BaseAction
) => {

+  switch (action.type) {
+    case UPDATE_USER_NAME:
+      return {
+        ...state,
+        name: action.payload,
+      };
+ }

  return state;
};
```

¿Qué estamos haciendo aquí?

- Me viene una acción y pasa por el reducer (aquí tenemos un switch).
- ¿Qué la acción no es la que espero? Pues devuelvo el estado tal cual.
- ¿Qué la acción es la que espero? Pues devuelvo el estado actualizado con el nuevo nombre.

Si te fijas esta actualización es inmutable, es decir lo que era el estado actual no lo modifico (no lo muto), si no que creo un nuevo objeto, varias cosas a tener en cuenta sobre esto:

- Nos complicamos la vida, y en algunos casos es un auténtico tostón actualizar el estado de manera inmutable.
- Ganamos mucho en que nuestro código es más robusto y mantenible (un cambio en un objeto no afecta a otro sin avisar).
- Si no te suena lo que son _los tres puntitos_ (spread operator), te toca ponerte a estudiar ES6: https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Operadores/Spread_operator
- La recomendación actual es utilizar una librería como _immer_ para gestionar la inmutabilidad: https://immerjs.github.io/immer/docs/introduction

Otro palabro más para terminar _un reducer_ se dice que es una _función pura_ ¿Esto que es?

Una función que no tiene efectos secundarios, es decir que no modifica nada fuera de ella, sólo devuelve un valor en función de los parámetros de entrada.

¿Qué NO son funciones puras?

- Una función que utilice una variable que éste definida fuera de ella.
- Una función qu lee de una API Rest.
- Una función que genera números aleatorios.

Lo que se busca es algo determinista, los efectos colaterales (side effects) aportan caos e intentamos aislaros en otro sitio.

Un último ajuste, en un reducer lo normal es sacar cada caso en una función aparte, algo así como:

_./src/reducers/user-profile.reducer.ts_

```diff

+ const handleUpdateUserName = (
+   state: UserProfileState,
+   name: string
+ ): UserProfileState => ({
+   ...state,
+   name,
+ });

export interface UserProfileState {
  name: string;
}

export const createDefaultUserProfile = (): UserProfileState => ({
  name: "Sin nombre",
});

export const userProfileReducer = (
  state: UserProfileState = createDefaultUserProfile(),
  action: BaseAction
) => {
  switch (action.type) {
    case UPDATE_USER_NAME:
-      return {
-        ...state,
-        name: action.payload,
-      };
+     return handleUpdateUserName(state, action.payload);
  }

  return state;
};
```

Ahora toca exponer esa acción al componente para que pueda modificar el estado de la aplicación.

¿Te acuerdas del mapDispatchToProps? Pues eso es lo que vamos a hacer:

_./src/user-profile/user-profile.container.tsx_

```diff
import { connect } from "react-redux";
import { UserProfileComponent } from "./user-profile.component";
import { AppState } from "../reducers";
+ import { BaseAction, createUpdateUserNameAction } from "../actions";
+ import { Dispatch } from "redux";

const mapStateToProps = (state: AppState) => ({
  name: state.userProfile.name,
});

+ const mapDispatchToProps = (dispatch: Dispatch<BaseAction>) => ({
+   onUpdateUserName: (name: string) => dispatch(createUpdateUserNameAction(name)),
+ });

export const UserProfileContainer =
-  connect(mapStateToProps)(UserProfileComponent);
+  connect(mapStateToProps, mapDispatchToProps)(UserProfileComponent);
```

¿Qué hacemos aquí? ... ¿Te acuerdas el famoso dispatcher? Pues en _mapDispatchToProps_ tenemos acceso la mismo, y lo que hacemos es definir una función (que después el componente presentacional la tendrá como _prop_) en la que recibimos el nuevo nombre, lo empaquetamos en la acción de _createUpdateUserNameAction_ y se lo pasamos al dispatcher, el dispatcher se va a encargar de pasearlo por todos los reducers para que vean si es su parada y actualicen estado.

En el connect añadimos como segundo parámetro el _mapDispatchToProps_.

> Como curiosidad el tercer parámetro de connect es _mergeProps_ que nos permite mezclar las propiedades que vienen del estado y las que vienen de las acciones (si ves algo de esto en código legacy es que se metieron en un buen berenjenal)

Así que ahora vamos a actualizarlo en el componente, a destacar aquí, como en las props y los narcos, el componente no sabe nada de redux, sólo sabe que le pasan una propiedad _onUpdateUserName_ que es una función que recibe un nombre y lo actualiza.

_./src/user-profile/user-profile.component.tsx_

```diff
import React from "react";

export interface UserProfileProps {
  name: string;
+ onUpdateUserName: (name: string) => void;
}


- export const UserProfileComponent: React.FC<UserProfileProps> = ({ name }) => {
+ export const UserProfileComponent: React.FC<UserProfileProps> = ({ name, onUpdateUserName }) => {
  return (
    <>
      <h2>User Profile</h2>
      <div>
        <label>Nombre:</label>
        <span>{name}</span>
+       <input value={name} onChange={e => onUpdateUserName(e.target.value)}>
      </div>
    </>
  );
};
```

Y ahora tenemos funcionando este ejemplo.

Seguramente estarás pensando... la que hemos liado para una etiqueta y un input :), tienes toda la razón, este ejemplo no tendría ningún sentido en la vida real, pero es para que veas como funciona el flujo de Redux, también comentarte en muchos tipos de aplicación tampoco tiene sentido meterse con Redux (cada herramienta tiene su uso, por ejemplo, por muchas ganas que tengas, no te vas a poner a matar moscas con un martillo).

Antes de seguir un apunte interesante, es muy fácil implementar pruebas unitarias en el:

- Reducer.
- Acciones.

Algo más complicado pero viable en:

- Contenedores.
- Componentes.

# Tipando

Hay un sitio donde todo este de redux hace aguas con TypeScript y es en tipar las acciones, eso de meter un _any_ en el payload como un castillo, es un coladero de errores.

Vamos a ver como podemos tipar esto:

_./src/actions/base.actions.ts_

```diff

+ export const ActionTypes = {
+  UPDATE_USER_NAME: "[USER_PROFILE] Update user name",
+ };

+ export type BaseAction =
+  | {type: ActionTypes.UPDATE_USER_NAME, payload: string};


- export interface BaseAction {
-  type: string;
-  payload: any; // Aupa el any !!
- }
```

Y ahora en la acción:

_./src/actions/user-profile.actions.ts_

```diff
- import { BaseAction } from "./base.actions";
+ import { ActionTypes, BaseAction } from "./base.actions";
-
- export const UPDATE_USER_NAME = "[USER_PROFILE] Update user name";

export const createUpdateUserNameAction = (name: string): BaseAction => ({
-  type: UPDATE_USER_NAME,
+ type: ActionTypes.UPDATE_USER_NAME,
  payload: name,
});
```

Y ahora en el reducer una vez que nos metemos en el case del switch el payload se tipa como string.

Si quieres práctica un poco, podrías probar a meter en ese reducer un apellido y montar toda la fontanería :).

A tener en cuenta:

- Lo normal en una aplicación real es que tengas varios reducers.
- Cada reducer tiene su propio estado y ésta aislado (no se puede habar directamente con reducers hermanos)
- Para comunicar reducers se utilizan acciones (que se pasan por todos los reducers).
- Si necesitas combinar datos de dos reducers, o bien los pides en el mapStateToProps o bien puedes usar campos calculados, había una librería que se llamaba [reselect](https://github.com/reduxjs/reselect) que si la están usando en el proyecto legacy que has entrado te tocará estudiar (es potente pero requiere su tiempo de estudio), o también en redux moderno tienes algo parecido ya incorporado.

# Maquina del tiempo y devools

TODO !!!!

# Sobre estructura de carpetas

La estructura de carpetas que hemos usado, sólo sirve para aprender como va _redux_ en un proyecto pequeño, es lo que se llama dividir una carpeta por tipo de elemento:

Aquí va el árbol de directorio

```
├── actions
│   ├── base.actions.ts
│   └── user-profile.actions.ts
├── reducers
│   ├── index.ts
│   └── user-profile.reducer.ts
├── user-profile
│   ├── index.ts
│   ├── user-profile.component.tsx
│   └── user-profile.container.tsx
├── App.css
├── App.tsx
├── index.tsx
```

pero en un proyecto real, lo normal es que tengas una estructura de carpetas por funcionalidad, es decir:

```
├── core
│   ├── base.actions.ts
│   ├── root.store.ts
│   ├── common.actions.ts
│   ├── common.reducers.ts
├── pods
│   ├── profile
│   |   ├── profile.actions.ts
│   |   ├── profile.reducers.ts
│   |   ├── profile.component.ts
│   |   ├── profile.container.ts
```

Y bueno aquí te puedes encontrar _fumadas_ de todos los colores, estudia bien como está todo organizado en tu proyecto legacy e intenta ser consistente cuando actualices código.

# Curiosidades

Redux está fuertemente inspirado en ELM, un lenguaje funcional que se ejecuta en el navegador, si te interesa el tema, puedes ver este vídeo: https://www.youtube.com/watch?v=NYb2GDWMIm0

¿Por qué se hizo tan popular Redux? Porque en React no había forma de manejar datos globales, el React Context apareció luego (al menos la versión estable)

Aplicaciones en las que puede tener sentido usar Redux:

- En una aplicación de un juego de tablero (ajedrez, dominó...), puedes ser interesante tener el estado en Redux si algo falla, puedes grabar los pasos completos y reproducirlo.
- En una aplicación como Slack (varios canales, actualizaciones, ....)

Donde no suele tener sentido, en una aplicación de gestión al uso.
