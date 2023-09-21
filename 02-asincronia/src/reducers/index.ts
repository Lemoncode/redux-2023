import { combineReducers } from "redux";
import { UserProfileState, userProfileReducer } from "./user-profile.reducer";
import { GithubMemberEntity } from "../model";
import { membersReducer } from "./members.reducer";

export interface AppState {
  userProfile: UserProfileState;
  members: GithubMemberEntity[];
}

export const rootReducer = combineReducers<AppState>({
  userProfile: userProfileReducer,
  members: membersReducer,
});
