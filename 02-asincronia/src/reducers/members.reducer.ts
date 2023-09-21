import { GithubMemberEntity } from "../model/github-member.model";
import { BaseAction } from "../actions";
import { ActionTypes } from "../actions";

const handleFetchMembersCompleted = (
  _: GithubMemberEntity[],
  members: GithubMemberEntity[]
) => [...members];

export const membersReducer = (
  state: GithubMemberEntity[] = [],
  action: BaseAction
) => {
  switch (action.type) {
    case ActionTypes.FETCH_MEMBERS_COMPLETED:
      return handleFetchMembersCompleted(state, action.payload);
  }

  return state;
};
