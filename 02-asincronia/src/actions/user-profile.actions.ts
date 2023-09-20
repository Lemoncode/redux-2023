import { BaseAction, ActionTypes } from "./base.actions";

export const createUpdateUserNameAction = (name: string): BaseAction => ({
  type: ActionTypes.UPDATE_USER_NAME,
  payload: name,
});
