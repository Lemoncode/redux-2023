export enum ActionTypes {
  UPDATE_USER_NAME = "[USER_PROFILE] Update user name",
}

export type BaseAction = {
  type: ActionTypes.UPDATE_USER_NAME;
  payload: string;
};
