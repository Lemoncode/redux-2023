import axios from "axios";
import { GithubMemberEntity } from "../model/github-member.model";

const url = "https://api.github.com/orgs/lemoncode/members";

export const getMembers = (): Promise<GithubMemberEntity[]> =>
  axios.get(url).then((response) => response.data);
