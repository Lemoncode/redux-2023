import { BaseAction } from "./base.actions";

export const UPDATE_USER_NAME = "[USER_PROFILE] Update user name";

export const createUpdateUserNameAction = (name: string): BaseAction => ({
  type: UPDATE_USER_NAME,
  payload: name,
});
