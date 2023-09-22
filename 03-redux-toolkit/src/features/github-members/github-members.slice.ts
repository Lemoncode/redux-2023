import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchMembers } from "./github-members.api";
import { GithubMember } from "./github-members.model";

export interface GithubMembersState {
  members: GithubMember[];
}

const initialState: GithubMembersState = {
  members: [],
};

export const githubMembersSlice = createSlice({
  name: "githubMembers",
  initialState,
  reducers: {
    setMembers: (state, action: PayloadAction<GithubMember[]>) => {
      state.members = action.payload;
    },
  },
});

export const { setMembers } = githubMembersSlice.actions;

export const fetchMembersAsync = createAsyncThunk(
  // TODO esto tendríamos que ver de ponerlo sin strings mágicos
  "githubMembers/setMembers",
  async () => {
    const members = await fetchMembers();
    return members;
  }
);

export const selectMembers = (state: { githubMembers: GithubMembersState }) =>
  state.githubMembers.members;

export default githubMembersSlice.reducer;
