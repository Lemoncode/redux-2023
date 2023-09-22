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
import userProfileReducer from "../features/user-profile";

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
+ import store from './app/store';
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
