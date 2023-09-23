import { GithubMemberEntity } from "../model/github-member.model";
import { getMembers } from "../api/github.api";
import { Dispatch } from "redux";
import { BaseAction, ActionTypes } from "./base.actions";

export const fetchMembersCompleted = (
  members: GithubMemberEntity[]
): BaseAction => ({
  type: ActionTypes.FETCH_MEMBERS_COMPLETED,
  payload: members,
});

export const fetchMembersRequest = () => (dispatch: Dispatch<BaseAction>) => {
  getMembers().then((members) => {
    dispatch(fetchMembersCompleted(members));
  });
};
