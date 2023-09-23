import { BaseAction, ActionTypes } from "../actions";

const handleUpdateUserName = (
  state: UserProfileState,
  name: string
): UserProfileState => ({
  ...state,
  name,
});

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
    case ActionTypes.UPDATE_USER_NAME:
      return handleUpdateUserName(state, action.payload);
  }

  return state;
};
