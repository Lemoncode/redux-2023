import { GithubMemberEntity } from "../model/github-member.model";

export const fetchMembersCompleted = (members: GithubMemberEntity[]) => ({
  type: "FETCH_MEMBERS_COMPLETED",
  payload: members,
});
