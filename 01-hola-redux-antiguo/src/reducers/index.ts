import { combineReducers } from "redux";
import { UserProfileState, userProfileReducer } from "./user-profile.reducer";

export interface AppState {
  userProfile: UserProfileState;
}

export const rootReducer = combineReducers<AppState>({
  userProfile: userProfileReducer,
});
