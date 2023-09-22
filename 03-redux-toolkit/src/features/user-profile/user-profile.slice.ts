import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../app-store/store";

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
export const selectName = (state: RootState) => state.userProfile.name;

// Y aquí sacamos el reducer
export default userProfileSlice.reducer;
