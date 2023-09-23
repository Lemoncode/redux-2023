# Redux Toolkit

Hasta ahora hemos visto como crear una aplicación Redux sin ayudas, esto es un dolor, y el equipo de Redux lo sabe, por eso crearon Redux Toolkit, una librería que nos ayuda a crear aplicaciones Redux de forma más sencilla.

Tiene una documentación muy buena (tutoriales, fundamentos), para arrancarte te puedes arrancar por la parte de
tutoriales: https://redux.js.org/tutorials/index y hasta una quick start para TypeScript: https://redux.js.org/tutorials/typescript-quick-start

# Arranque

Vamos a partir del ejemplo _00 boiler plate_ y vamos a crear un proyecto desde cero con Redux (implementaremos tanto el _userprofile_ como el _members_ de los ejemplos anteriores), pero esta vez usando el toolkit.

Copiamos e instalamos dependencias:

```bash
npm install
```

# Instalación

Aquí instalamos el toolkit:

```bash
npm install @reduxjs/toolkit react-redux
```

> También se puede arrancar tirando de plantillas, hay una [plantilla oficial en Vite](https://github.com/reduxjs/redux-templates), y aquí las instrucciones para configurarla: https://redux-toolkit.js.org/introduction/getting-started

Ya podemos dejar corriendo nuestro servidor local:

```bash
npm run dev
```

# Estructura de la aplicación

Redux toolkit nos da ya una estructura para arrancarnos, el árbol que queda:

```bash
├── src
│   ├── index.tsx    // El index de la aplicación
│   ├── App.tsx      // El componente App
│   ├── /app-store   // Aquí va el store, normalmente suele haber sólo uno
│   │   ├── store.ts
│   ├── /features    // Agrupamos por características, así tenemos todo en una isla
│   │   ├── /user-profile
│   │   │     ├── user-profile.component.ts
│   │   │     ├── user-profile.slice.ts
│   │   ├── /github-members
│   │   │     ├── github-members.component.ts
│   │   │     ├── github-members.slice.ts
```

# User Profile slice

Si te fijas en redux _antiguo_ creábamos por un lado las acciones y por otro los reducers, esto es un asco, porque el 90% de las veces son cosas que están muy cohesionadas, ¿Por qué no agruparlo todo en un mismo sitio? Y para el 5% que sea acciones que tengan que pasar por más de un reducer pues ya nos creamos algo común.

Vamos entonces a definir el _user-profile.slice.ts_

_./src/features/user-profile/user-profile.slice.ts_

```typescript
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserProfileState {
  name: string;
}

const initialState: UserProfileState = {
  name: "Sin nombre",
};

export const userProfileSlice = createSlice({
  name: "userProfile",
  initialState,
  // Ni switch ni nada, objeto reducer y que hace cada acción
  reducers: {
    setName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
  },
});

// De aquí saco las acciones
export const { setName } = userProfileSlice.actions;

// Esto es un selector para sacar los datos, OJO aquí nos falta el tipado del RootState (store)
export const selectName = (state: { userProfile: UserProfileState }) =>
  state.userProfile.name;

// Y aquí sacamos el reducer
export default userProfileSlice.reducer;
```

# Registro store y app

Este slice lo vamos a registrar en el store:

_./src/app-store/store.ts_

```ts
import { configureStore } from "@reduxjs/toolkit";
import userProfileReducer from "../features/user-profile/user-proflie.slice";

export const store = configureStore({
  reducer: {
    userProfile: userProfileReducer,
  },
});

// Aquí sacamos el tipo de RootState del state con typeof
export type RootState = ReturnType<typeof store.getState>;
// Y aquí lo mismo sacamos el tipo del dispatch y las acciones del typeof del dispatch
export type AppDispatch = typeof store.dispatch;
```

Ahora viene algo que da un poco de grima, vamos a meter una referencia circular para para poder tipar el useSelector, esto es un poco _hack_ pero es lo que hay:

_./src/features/user-profile/user-profile.slice.tsx_

```diff
+ import type { RootState } from "../../app-store/store";
  import { createSlice, PayloadAction } from "@reduxjs/toolkit";

  // (...)
// Esto es un selector para sacar los datos, OJO aquí nos falta el tipado del RootState (store)
- export const selectName = (state: { userProfile: UserProfileState }) =>
+ export const selectName = (state: RootState) =>
    state.userProfile.name;

// Y aquí sacamos el reducer
export default userProfileSlice.reducer;
```

Toca registrar ahora el store en la aplicación, esta vez lo hacemos en nuestro _main.tsx_:

_./src/main.tsx_

```diff
import React from 'react';
import ReactDOM from 'react-dom/client';
+ import { Provider } from 'react-redux';
import App from './App.tsx';
+ import {store} from "./app-store/store";
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
+    <Provider store={store}>
      <App />
+    </Provider>
  </React.StrictMode>,
)
```

# User Profile component

Ahora vamos a crear el componente que va a usar el slice:

Primero vamos a leer el valor

_./src/features/user-profile/user-profile.component.tsx_

```typescript
import { useSelector } from "react-redux";
import { selectName } from "./user-profile.slice";

export const UserProfileComponent = () => {
  const name = useSelector(selectName);

  return (
    <div>
      <h2>User Profile</h2>
      <p>Nombre: {name}</p>
    </div>
  );
};
```

Ahora vamos a editarlo:

_./src/features/user-profile/user-profile.component.tsx_

```diff
import React from "react";
import { useSelector } from "react-redux";
- import { selectName } from "./user-profile.slice";
+ import { selectName, setName } from "./user-profile.slice";
+ import { useDispatch } from "react-redux";
+ import { AppDispatch } from "../../app-store/store";

export const UserProfileComponent = () => {
  const name = useSelector(selectName);
+ const dispatch = useDispatch<AppDispatch>();

+ const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
+   dispatch(setName(event.target.value));
+ };

  return (
    <div>
      <h2>User Profile</h2>
      <p>Nombre: {name}</p>
+     <input type="text" value={name} onChange={handleNameChange} />
    </div>
  );
};
```

Y lo instanciamos a nivel de App:

_./src/App.tsx_

```diff
import "./App.css";
+ import { UserProfileComponent } from "./features/user-profile/user-profile.component";

function App() {
  return (
    <>
      <header>Redux 2023 - Boilerplate</header>
-      <main>Aquí van las demos..</main>
+      <main>
+        <UserProfileComponent />
+      </main>
    </>
  );
}

export default App;
```

Vamos a ver que todo funciona y recapitulamos.

Por si no lo teneemos arrancado

```bash
npm run dev
```

# Async - Github Members

¿Y los Thunk como funcionan con el nuevo Toolkit? Pues resulta que los trae incorporado.

## API

Esto no tiene que ver con Redux.

Utilizaremos Axios:

```bash
npm install axios
```

Vamos a crear una feature para los miembros de github, y añadir el modelo y la api.

_./src/features/github-members/github-members.model.ts_

```typescript
export interface GithubMember {
  id: number;
  login: string;
  avatar_url: string;
}
```

Vamos a crear un fichero de api para leer los datos con axios:

_./src/features/github-members/github-members.api.ts_

```typescript
import axios from "axios";
import { GithubMember } from "./github-members.model";

export const fetchMembers = async () => {
  const response = await axios.get<GithubMember[]>(
    "https://api.github.com/orgs/lemoncode/members"
  );
  return response.data;
};
```

Vamos a crear un slice para los miembros de github, aquí tenemos un poco de _magia_:

- Tenenemos una función de ayuda _createAsyncThunk_ en la que le indicamos el nombre base de la acción y la función asíncrona que queremos ejecutar.
- En la parte de reducers, tenemos que añadir una sección de _extraReducers_ en la que le indicamos acciones adicionales a escuchar, en este caso el thunk de _fetchMembersAsync_ tiene 3 acciones asociadas: _pending_, _fulfilled_ y _rejected_ (en las devtools puedes ver la pending y la FullFilled), nos enganchamos a la _fulfilled_ y actualizamos el estado.

> Fijate que en las devtools sale duplicado, esto es por lo que comentamos anteriormente, que las últimas version de React por defecto ejecutan dos veces el _useEffect_ al montarse el componente (en desarrollo no).

Para los Thunk hay una función de ayuda que nos permite crearlos

_./src/features/github-members/github-members.slice.ts_

```typescript
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchMembers } from "./github-members.api";
import { GithubMember } from "./github-members.model";

export interface GithubMembersState {
  members: GithubMember[];
}

const initialState: GithubMembersState = {
  members: [],
};

const SLICE_NAME = "githubMembers";

export const githubMembersSlice = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(fetchMembersAsync.fulfilled, (state, action) => {
      state.members = action.payload;
    });
  },
});

export const {} = githubMembersSlice.actions;

export const fetchMembersAsync = createAsyncThunk(
  `${SLICE_NAME}/fetchMembers`,
  async () => {
    const members = await fetchMembers();
    return members;
  }
);

export const selectMembers = (state: { githubMembers: GithubMembersState }) =>
  state.githubMembers.members;

export default githubMembersSlice.reducer;
```

Vamos añadir ese slice al store:

_./src/app-store/store.ts_

```diff
import { configureStore } from "@reduxjs/toolkit";
import userProfileReducer from "../features/user-profile/user-profile.slice";
+ import githubMembersReducer from "../features/github-members/github-members.slice";

export const store = configureStore({
  reducer: {
    userProfile: userProfileReducer,
+    githubMembers: githubMembersReducer,
  },
});

// Aquí sacamos el tipo de RootState del state con typeof
export type RootState = ReturnType<typeof store.getState>;
// Y aquí lo mismo sacamos el tipo del dispatch y las acciones del typeof del dispatch
export type AppDispatch = typeof store.dispatch;
```

Y ahora vamos a crear el componente que va a usar el slice, primero ponemos el estilado:

_./src/features/github-members/github-members.component.module.css_

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

Y ahora el componente:

_./src/features/github-members/github-members.component.tsx_

```typescript
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMembersAsync, selectMembers } from "./github-members.slice";
import { AppDispatch } from "../../app-store/store";
import styles from "./github-members.component.module.css";

export const GithubMembersComponent = () => {
  const members = useSelector(selectMembers);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchMembersAsync());
  }, []);

  return (
    <div>
      <h2>Github Members</h2>
      <div className={styles.container}>
        <div className={styles.header}>Avatar</div>
        <div className={styles.header}>Id</div>
        <div className={styles.header}>Login</div>
        {members.map((member) => (
          <React.Fragment key={member.id}>
            <img src={member.avatar_url} alt="avatar" />
            <div>{member.id}</div>
            <div>{member.login}</div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
```

Y vamos a usarlo:

_./src/App.tsx_

```diff
import "./App.css";
import { UserProfileComponent } from "./features/user-profile/user-profile.component";
+ import { GithubMembersComponent } from "./features/github-members/github-members.component";

function App() {
  return (
    <>
      <header>Redux 2023 - Boilerplate</header>
      <main>
        <UserProfileComponent />
+       <GithubMembersComponent />
      </main>
    </>
  );
}

export default App;

```
