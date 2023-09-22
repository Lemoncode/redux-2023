import axios from "axios";
import { GithubMember } from "./github-members.model";

export const fetchMembers = async () => {
  const response = await axios.get<GithubMember[]>(
    "https://api.github.com/orgs/lemoncode/members"
  );
  return response.data;
};
