import { GithubMemberEntity } from "../model";

export enum ActionTypes {
  UPDATE_USER_NAME = "[USER_PROFILE] Update user name",
  FETCH_MEMBERS_COMPLETED = "[MEMBERS] Fetch members completed",
}

export type BaseAction =
  | {
      type: ActionTypes.UPDATE_USER_NAME;
      payload: string;
    }
  | {
      type: ActionTypes.FETCH_MEMBERS_COMPLETED;
      payload: GithubMemberEntity[];
    };
